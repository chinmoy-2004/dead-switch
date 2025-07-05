import nodemailer from 'nodemailer';
import { decryptBuffer } from './crypto.js';
import { downloadFromS3 } from './s3.js';

export const sendEmail = async (payload) => {
  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Decrypt the main message if available
  let decryptedText = "";
  if (payload.encryptedData && payload.key && payload.iv) {
    decryptedText = decryptBuffer(
      Buffer.from(payload.encryptedData, 'hex'),
      payload.key,
      payload.iv
    ).toString();
  }

  // Prepare attachments if any
  const attachments = [];
  if (payload.attachments?.length) {
    for (const attachment of payload.attachments) {
      console.log(`Downloading attachment: ${attachment.s3path}`);
      const encryptedBuffer = await downloadFromS3(attachment.s3path);
      const decryptedBuffer = decryptBuffer(
        encryptedBuffer,
        attachment.key,
        attachment.iv
      );

      attachments.push({
        filename: attachment.filename,
        content: decryptedBuffer
      });
    }
  }

  // Build a professional email body
  const emailBody = `
Dear Recipient,

This is an automated message sent from the Dead Man's Switch service.

${decryptedText ? `Message:\n${decryptedText}` : `A message has been securely attached to this email.`}

If you believe you've received this message in error, please disregard it.

Regards,  
Dead Man's Switch Team
  `.trim();

  // Send the email
  await transporter.sendMail({
    from: `"Dead Man's Switch" <${process.env.EMAIL_USER}>`,
    to: Array.isArray(payload.target) ? payload.target.join(',') : payload.target,
    subject: "⏳ Dead Man's Switch Triggered – Confidential Message Enclosed",
    text: emailBody,
    attachments
  });

  console.log("Email sent successfully!");
};

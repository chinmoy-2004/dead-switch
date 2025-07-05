import pkg from 'aws-sdk';
const { S3 } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: process.env.endpoint, // Cloudflare R2 endpoint
  region: "auto",                                  
  signatureVersion: "v4",         
});

// Upload to Cloudflare R2
export const uploadToS3 = async (buffer, key, mimetype) => {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
    };
    await s3.upload(params).promise();
    return key;
};

// Download from Cloudflare R2
export const downloadFromS3 = async (key) => {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
    };
    const data = await s3.getObject(params).promise();
    return data.Body;
}; 


// Delete from Cloudflare R2
export const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };
  await s3.deleteObject(params).promise();
  console.log(`Deleted from S3: ${key}`);
};

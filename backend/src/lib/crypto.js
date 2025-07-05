
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Save this securely per file
const iv = crypto.randomBytes(16);  // Save this securely per file

export const encryptBuffer = (buffer) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { encryptedData: encrypted, key: key.toString('hex'), iv: iv.toString('hex') };
};

export const decryptBuffer = (buffer, keyHex, ivHex) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(keyHex, 'hex'), Buffer.from(ivHex, 'hex'));
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted;
};

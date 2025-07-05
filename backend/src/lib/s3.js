import pkg from 'aws-sdk';
const { S3 } = pkg;

const s3 = new S3({
  accessKeyId: "e9364087820e6856708f8c4e724a3c99",
  secretAccessKey: "fbc8a523f713f8abf0fdb4598efe3198764c87638e5a0ba2a50b17619e6d8ac8",
  endpoint: "https://572116e5654202128200d5e8e0e340ca.r2.cloudflarestorage.com",  
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

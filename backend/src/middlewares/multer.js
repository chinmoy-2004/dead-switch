// middleware/upload.js
import multer from 'multer';

const storage = multer.memoryStorage(); // Store in memory for encryption
const upload = multer({ storage });

export default upload;

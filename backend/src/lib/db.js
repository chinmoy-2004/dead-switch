import moongose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const  connectDB = async () => {
    try {
        moongose.set('strictQuery', true); // suppresses the warning

        console.log('Connecting to MongoDB...');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        const conn=await moongose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`mongoDB connection error: ${error}`);
    }

}


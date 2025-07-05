import mongoose from "mongoose";
import { deleteFromS3 } from "../lib/s3.js";
import { encryptBuffer } from "../lib/crypto.js";
import { uploadToS3 } from "../lib/s3.js";
import Payload from "../schema/payload.schema.js";
import { decryptBuffer } from "../lib/crypto.js";



export const createPayload = async (req, res) => {
    try {
        const { switchId, target, rawdata } = req.body;
        if (!switchId || !target) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Encrypt optional raw text
        const { encryptedData, iv, key } = rawdata ? encryptBuffer(Buffer.from(rawdata)) : { encryptedData: null, iv: null, key: null };
        console.log("Encrypted Data:", encryptedData?.toString('hex') ?? null);
        // Process file attachments
        const files = req.files || [];
        console.log("Files received:", files);
        const attachments = [];

        for (const file of files) {
            const { buffer, mimetype, originalname } = file;
            const fileType = mimetype.startsWith("image/") ? "image" : "file";

            const { encryptedData, iv, key } = encryptBuffer(buffer); // Encrypt file buffer
            const s3Key = `deadman/${Date.now()}_${originalname}`;
            await uploadToS3(encryptedData, s3Key, mimetype);
            console.log(`File uploaded to S3: ${s3Key}`);
            attachments.push({
                type: fileType,
                s3path: s3Key,
                iv,
                key: key,
                filename: originalname
            });
        }

        // Create and save payload
        const payloadData = {
            switchId,
            target,
            encryptedData: encryptedData?.toString('hex') ?? null,
            iv: iv ?? null,
            key: key ?? null,
            attachments
        };

        const payload = new Payload(payloadData);
        await payload.save();

        if(!payload){
            return res.status(500).json({ error: "Failed to create payload" });
        }

        res.status(201).json(payload);

    } catch (error) {
        console.error("Error creating payload:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deletePayload = async (switchId) => {
    try {
        const payload = await Payload.findOne({ switchId });
        if (payload.attachments && payload.attachments.length > 0) {
            for (const attachment of payload.attachments) {
                console.log(`deleting attachment: ${attachment.s3path}`);
                // delete encrypted file from R2
                deleteFromS3(attachment.s3path)
            }
        }
        const deletedPayload = await Payload.findOneAndDelete({ switchId });
        if (!deletedPayload) {
            return { message: "Payload not found" };
        }

    } catch (error) {
        console.error("Error deleting payload:", error);
        return { error: "Internal server error" };
    }

}

export const getPayloadBySwitchId = async (req, res) => {
    try {
        const { id } = req.params;
        const switchId = new mongoose.Types.ObjectId(id); // ✅ Cast it
        const payload = await Payload.findOne({ switchId });
        let decryptedText = "";
        if (payload.encryptedData && payload.key && payload.iv) {
            decryptedText = decryptBuffer(
                Buffer.from(payload.encryptedData, 'hex'),
                payload.key,
                payload.iv
            ).toString();
        }

        if (!payload) {
            return res.status(404).json({ message: "Payload not found" });
        }

        // console.log("Payload fetched:", payload);

        res.status(200).json({
            payload:payload,
            decryptedText:decryptedText,
        });
    }
    catch (error) {
        console.log("error in getting payload", error)
        res.status(500).json({ error: "Internal server error" });
    }
}



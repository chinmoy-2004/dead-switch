import mongoose from 'mongoose';



const attachmentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'file'],
        required: true
    },
    s3path: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
}, { _id: false });

const payloadSchema = new mongoose.Schema({
    switchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Switch',
        required: true
    },

    //Target email addresses or webhook URLs
    target: {
        type: [String], // allows multiple email addresses
        required: true
    },


    // Optional text content (encrypted)
    encryptedData: {
        type: String
    },
    iv: {
        type: String
    },
    key: {
        type: String
    },

    attachments: {
        type: [attachmentSchema],
        default: []
    }
})

const Payload = mongoose.models.Payload || mongoose.model('Payload', payloadSchema);
export default Payload;

import mongoose from 'mongoose';


const SwitchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "No description provided",
    },
    interval: {
        type: Number,
        required: true,
    },//in minutes
    lastping:{
        type:Date,
        default: Date.now,
    },
    status:{
        type:String,
        enum:["active","expired"],
        default:"active",
    }
    

},{timestamps:true});

const Switch = mongoose.model('Switch', SwitchSchema);
export default Switch;
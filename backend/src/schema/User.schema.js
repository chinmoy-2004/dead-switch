import moongose from 'mongoose';

const UserSchema = new moongose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const User = moongose.model('User', UserSchema);
export default User;
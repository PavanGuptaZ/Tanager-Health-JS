import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [30, "Movie name must not have more than 100 characters"],
        minlength: [5, "Movie name must have at least 4 charachters"],
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        min: 6999999999,
        max: 9999999999
    },
    role: {
        type: String,
        default: 'user',
        inmutable: true
    }
}, { timestamps: true })

export default new mongoose.model('user', userSchema)
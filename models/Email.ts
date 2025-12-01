import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmail extends Document {
    email: string;
    createdAt: Date;
}

const EmailSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email address.'],
        unique: true, // Prevent duplicates
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'Early Access' });

// Check if the model is already compiled to prevent OverwriteModelError
const Email: Model<IEmail> = mongoose.models.Email || mongoose.model<IEmail>('Email', EmailSchema);

export default Email;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEntry extends Document {
    title: string;
    category: string;
    timeSpent: number;
    problemsSolved: number;
    notes?: string;
    date: Date;
    createdAt: Date;
}

const EntrySchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['DSA', 'Development', 'System Design', 'Interview Prep', 'Learning'],
    },
    timeSpent: {
        type: Number,
        required: [true, 'Please provide time spent in minutes'],
        min: 0,
    },
    problemsSolved: {
        type: Number,
        required: [true, 'Please provide number of problems solved'],
        min: 0,
        default: 0,
    },
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot be more than 1000 characters'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Entry: Model<IEntry> = mongoose.models.Entry || mongoose.model<IEntry>('Entry', EntrySchema);

export default Entry;

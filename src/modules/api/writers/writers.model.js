import mongoose, { Schema } from 'mongoose';

import writersConstants from './writers.constant.js';
import sharedSchema from '../../../shared/schema.js';

const writerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Name cannot be empty.'],
            minlength: [
                writersConstants.lengths.NAME_MIN,
                'Name must be at least 3 character long.',
            ],
            maxlength: [
                writersConstants.lengths.NAME_MAX,
                'Name cannot be more than 100 characters long.',
            ],
        },
        image: sharedSchema.imageSchema,
        review: {
            type: Number,
            min: [0, 'Review must be at least 0.'],
            max: [5, 'Review cannot be more than 5.'],
            required: [true, 'Review is required.'],
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Summary is required.'],
            minlength: [
                writersConstants.lengths.SUMMARY_MIN,
                'Summary must be at least 10 characters long.',
            ],
            maxlength: [
                writersConstants.lengths.SUMMARY_MAX,
                'Summary cannot be more than 1000 characters long.',
            ],
        },
        isActive: sharedSchema.isActiveSchema,
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-save middleware for creation
writerSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        next(new Error('Creator is required.'));
    } else {
        next();
    }
});

// Pre-update middleware for updates
writerSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        next(new Error('Updater is required.'));
    } else {
        next();
    }
});

const WritersModel = mongoose.model('Writers', writerSchema);

export default WritersModel;

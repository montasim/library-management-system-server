import mongoose from 'mongoose';

import writersConstants from './writers.constant.js';
import sharedSchema from '../../../shared/schema.js';

const writerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide a name for the writer.'],
            minlength: [
                writersConstants.lengths.NAME_MIN,
                `Writer's name must be at least ${writersConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                writersConstants.lengths.NAME_MAX,
                `Writer's name cannot exceed ${writersConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description:
                'The name of the writer. It must be unique and conform to specified length constraints.',
        },
        image: sharedSchema.imageSchema,
        review: {
            type: Number,
            min: [
                writersConstants.lengths.REVIEW_MIN,
                `Review must be at least ${writersConstants.lengths.REVIEW_MIN}.`,
            ],
            max: [
                writersConstants.lengths.REVIEW_MAX,
                `Review cannot be more than ${writersConstants.lengths.REVIEW_MAX}.`,
            ],
            required: [true, 'Please provide a review rating for the writer.'],
            description: `The review rating of the writer, ranging from ${writersConstants.lengths.REVIEW_MIN} to ${writersConstants.lengths.REVIEW_MAX}.`,
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Please provide a summary for the writer.'],
            minlength: [
                writersConstants.lengths.SUMMARY_MIN,
                `Summary must be at least ${writersConstants.lengths.SUMMARY_MIN} characters long.`,
            ],
            maxlength: [
                writersConstants.lengths.SUMMARY_MAX,
                `Summary cannot exceed ${writersConstants.lengths.SUMMARY_MAX} characters in length.`,
            ],
            description:
                'A brief summary of the writer’s profile, within specified length constraints.',
        },
        isActive: sharedSchema.isActiveSchema,
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

// Create a unique index on the name field
writerSchema.index({ name: 1 }, { unique: true });

// Pre-save and update middleware
writerSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

// Error handling middleware for unique constraint violations
writerSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Writer name already exists.'));
    } else {
        next(error);
    }
});

const WritersModel = mongoose.model('Writers', writerSchema);

export default WritersModel;

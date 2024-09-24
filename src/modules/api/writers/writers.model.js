/**
 * @fileoverview This file defines the Mongoose schema for storing writer data.
 * The schema includes fields for the writer's name, image, review rating, summary, and activity status.
 * It also includes fields for tracking the user who created and last updated the writer record.
 * The schema ensures that the writer data conforms to specified validation rules and constraints.
 * Additionally, it includes middleware for pre-save/update validation and error handling.
 */

import mongoose from 'mongoose';

import writersConstants from './writers.constant.js';
import sharedSchema from '../../../shared/schema.js';

/**
 * Schema for storing writer data with automatic timestamping for creation and updates.
 *
 * @constant
 * @type {mongoose.Schema}
 * @description This schema includes fields for:
 * - name: The name of the writer (unique, required, with length constraints).
 * - image: The image of the writer (referencing a shared image schema).
 * - review: The review rating of the writer (required, with value constraints).
 * - summary: A brief summary of the writer's profile (required, with length constraints).
 * - isActive: A flag indicating whether the writer is active (referencing a shared isActive schema).
 * - createdBy: The user who created the writer record (referencing a shared createdByAdmin schema).
 * - updatedBy: The user who last updated the writer record (referencing a shared updatedByAdmin schema).
 *
 * The schema also includes:
 * - A unique index on the name field to ensure writer names are unique.
 * - Pre-save and update middleware to enforce the presence of creator/updater information.
 * - Error handling middleware for unique constraint violations.
 */
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
        summary: {
            type: String,
            trim: true,
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
        booksCount: {
            type: Number,
            default: 0,
            description: 'The number of books available for the writer.',
        },
        review: {
            type: Number,
            max: [
                writersConstants.lengths.REVIEW_MAX,
                `Review cannot be more than ${writersConstants.lengths.REVIEW_MAX}.`,
            ],
            description: `The review rating of the writer, ranging from ${writersConstants.lengths.REVIEW_MIN} to ${writersConstants.lengths.REVIEW_MAX}.`,
        },
        isActive: sharedSchema.isActiveSchema
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

const WritersModel = mongoose.models.Writers || mongoose.model('Writers', writerSchema);

export default WritersModel;

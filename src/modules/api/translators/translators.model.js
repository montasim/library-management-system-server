/**
 * @fileoverview This file defines the Mongoose schema for storing translator data.
 * The schema includes fields for the translator's name, image, review rating, summary, and activity status.
 * It also includes fields for tracking the user who created and last updated the translator record.
 * The schema ensures that the translator data conforms to specified validation rules and constraints.
 * Additionally, it includes middleware for pre-save/update validation and error handling.
 */

import mongoose from 'mongoose';

import translatorsConstants from './translators.constant.js';
import sharedSchema from '../../../shared/schema.js';

/**
 * Schema for storing translator data with automatic timestamping for creation and updates.
 *
 * @constant
 * @type {mongoose.Schema}
 * @description This schema includes fields for:
 * - name: The name of the translator (unique, required, with length constraints).
 * - image: The image of the translator (referencing a shared image schema).
 * - review: The review rating of the translator (required, with value constraints).
 * - summary: A brief summary of the translator's profile (required, with length constraints).
 * - isActive: A flag indicating whether the translator is active (referencing a shared isActive schema).
 * - createdBy: The user who created the translator record (referencing a shared createdByAdmin schema).
 * - updatedBy: The user who last updated the translator record (referencing a shared updatedByAdmin schema).
 *
 * The schema also includes:
 * - A unique index on the name field to ensure translator names are unique.
 * - Pre-save and update middleware to enforce the presence of creator/updater information.
 * - Error handling middleware for unique constraint violations.
 */
const translatorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide a name for the translator.'],
            minlength: [
                translatorsConstants.lengths.NAME_MIN,
                `Translator's name must be at least ${translatorsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                translatorsConstants.lengths.NAME_MAX,
                `Translator's name cannot exceed ${translatorsConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description:
                'The name of the translator. It must be unique and conform to specified length constraints.',
        },
        image: sharedSchema.imageSchema,
        summary: {
            type: String,
            trim: true,
            minlength: [
                translatorsConstants.lengths.SUMMARY_MIN,
                `Summary must be at least ${translatorsConstants.lengths.SUMMARY_MIN} characters long.`,
            ],
            maxlength: [
                translatorsConstants.lengths.SUMMARY_MAX,
                `Summary cannot exceed ${translatorsConstants.lengths.SUMMARY_MAX} characters in length.`,
            ],
            description:
                'A brief summary of the translator’s profile, within specified length constraints.',
        },
        booksCount: {
            type: Number,
            default: 0,
            description: 'The number of books available for the translator.',
        },
        review: {
            type: Number,
            max: [
                translatorsConstants.lengths.REVIEW_MAX,
                `Review cannot be more than ${translatorsConstants.lengths.REVIEW_MAX}.`,
            ],
            description: `The review rating of the translator, ranging from ${translatorsConstants.lengths.REVIEW_MIN} to ${translatorsConstants.lengths.REVIEW_MAX}.`,
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
translatorSchema.index({ name: 1 }, { unique: true });

const TranslatorsModel =
    mongoose.models.Translators ||
    mongoose.model('Translators', translatorSchema);

export default TranslatorsModel;

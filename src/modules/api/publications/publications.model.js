/**
 * @fileoverview This file defines the Mongoose schema for the Publications model. The schema includes
 * fields for publication details, such as name and status, and includes shared schema components for
 * consistent fields like isActive, createdBy, and updatedBy. The schema also features unique indexing
 * on the name field, and middleware for validation and error handling.
 */

import mongoose from 'mongoose';

import publicationsConstants from './publications.constant.js';
import sharedSchema from '../../../shared/schema.js';

/**
 * publicationSchema - Mongoose schema for the Publications model. This schema defines the structure
 * and constraints for storing publication-related data in the database. It includes:
 *
 * - name: String (required, unique, trimmed, minlength, maxlength)
 * - isActive: Shared schema for active status
 * - createdBy: Shared schema for created by admin details
 * - updatedBy: Shared schema for updated by admin details
 *
 * The schema also includes automatic timestamping for creation and updates,
 * and ensures uniqueness of the name field.
 */
const publicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide a name for the publication.'],
            minlength: [
                publicationsConstants.lengths.NAME_MIN,
                `Publication name must be at least ${publicationsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                publicationsConstants.lengths.NAME_MAX,
                `Publication name cannot exceed ${publicationsConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description:
                'The name of the publication, representing different journals or reviews.',
        },
        booksCount: {
            type: Number,
            default: 0,
            description: 'The number of books available for the publication.',
        },
        review: {
            type: Number,
            max: [
                publicationsConstants.lengths.REVIEW_MAX,
                `Review cannot be more than ${publicationsConstants.lengths.REVIEW_MAX}.`,
            ],
            description: `The review rating of the publication, maximum ${publicationsConstants.lengths.REVIEW_MAX}.`,
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
publicationSchema.index({ name: 1 }, { unique: true });

const PublicationsModel =
    mongoose.models.Publications ||
    mongoose.model('Publications', publicationSchema);

export default PublicationsModel;

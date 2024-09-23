/**
 * @fileoverview This file defines the Mongoose schema for the Subjects model. The schema includes
 * fields for subject details such as name and status, and uses shared schema components for
 * consistent fields like isActive, createdBy, and updatedBy. The schema also features unique
 * indexing on the name field, and middleware for validation and error handling.
 */

import mongoose, { Schema } from 'mongoose';

import subjectsConstants from './subjects.constant.js';
import sharedSchema from '../../../shared/schema.js';

/**
 * subjectSchema - Mongoose schema for the Subjects model. This schema defines the structure
 * and constraints for storing subject-related data in the database. It includes:
 *
 * - name: String (required, unique, trimmed, minlength, maxlength)
 * - isActive: Shared schema for active status
 * - createdBy: Shared schema for created by admin details
 * - updatedBy: Shared schema for updated by admin details
 *
 * The schema also includes automatic timestamping for creation and updates,
 * and ensures uniqueness of the name field.
 */
const subjectSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide a name for the subject.'],
            minlength: [
                subjectsConstants.lengths.NAME_MIN,
                `Subject name must be at least ${subjectsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                subjectsConstants.lengths.NAME_MAX,
                `Subject name cannot exceed ${subjectsConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description:
                'The name of the subject. It must be unique and conform to specified length constraints.',
        },
        booksCount: {
            type: Number,
            default: 0,
            description: 'The number of books available for the subject.',
        },
        review: {
            type: Number,
            max: [
                subjectsConstants.lengths.REVIEW_MAX,
                `Review cannot be more than ${subjectsConstants.lengths.REVIEW_MAX}.`,
            ],
            description: `The review rating of the subject, maximum ${subjectsConstants.lengths.REVIEW_MAX}.`,
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
subjectSchema.index({ name: 1 }, { unique: true });

/**
 * Pre-save and update Middleware - A middleware that runs before save and update operations to
 * ensure the presence of createdBy and updatedBy fields. Throws an error if these fields are missing.
 *
 * @param {Function} next - The next middleware function in the stack.
 * @throws {Error} - Throws an error if createdBy or updatedBy fields are missing.
 */
subjectSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

/**
 * Error Handling Middleware - A middleware that runs after save and update operations to handle
 * unique constraint violations. If a duplicate name is detected, it throws an error indicating
 * that the subject name already exists.
 *
 * @param {Error} error - The error object passed to the middleware.
 * @param {Document} doc - The document being processed.
 * @param {Function} next - The next middleware function in the stack.
 */
subjectSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Subject name already exists.'));
    } else {
        next(error);
    }
});

// Check if the model already exists before defining it
const SubjectsModel = mongoose.model('Subjects', subjectSchema);

export default SubjectsModel;

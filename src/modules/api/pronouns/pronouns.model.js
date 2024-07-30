import mongoose from 'mongoose';

import pronounsConstants from './pronouns.constant.js';
import sharedSchema from '../../../shared/schema.js';

const pronounsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            sparse: true,
            unique: true,
            required: [true, 'Please provide a name for the pronouns.'],
            match: [
                pronounsConstants.pattern.NAME,
                'Invalid format for pronouns. Please use only alphabetic characters and spaces, e.g., "Male", "Female".',
            ],
            minlength: [
                pronounsConstants.lengths.NAME_MIN,
                `Pronouns name must be at least ${pronounsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                pronounsConstants.lengths.NAME_MAX,
                `Pronouns name cannot exceed ${pronounsConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description:
                'The name of the pronouns, representing different gender identities.',
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
pronounsSchema.index({ name: 1 }, { unique: true });

// Pre-save and update middleware
pronounsSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

// Error handling middleware for unique constraint violations
pronounsSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Pronouns name already exists.'));
    } else {
        next(error);
    }
});

const PronounsModel = mongoose.model('Pronouns', pronounsSchema);

export default PronounsModel;

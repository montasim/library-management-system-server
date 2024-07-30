import mongoose from 'mongoose';

import publicationsConstants from './publications.constant.js';
import sharedSchema from '../../../shared/schema.js';

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

// Pre-save and update middleware
publicationSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

// Error handling middleware for unique constraint violations
publicationSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Publication name already exists.'));
    } else {
        next(error);
    }
});

const PublicationsModel = mongoose.model('Publications', publicationSchema);

export default PublicationsModel;

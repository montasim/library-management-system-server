import mongoose from 'mongoose';

import publicationsConstants from './publications.constant.js';
import sharedSchema from '../../../shared/schema.js';

const { Schema } = mongoose;

const publicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Please provide a name for the publication.'],
            minlength: [
                publicationsConstants.lengths.NAME_MIN,
                `Publication name must be at least ${publicationsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                publicationsConstants.lengths.NAME_MAX,
                `Publication name cannot exceed ${publicationsConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description: 'The name of the publication, representing different journals or reviews.',
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
publicationSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        return next(new Error('Creator is required.'));
    }

    next();
});

// Pre-update middleware for updates
publicationSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        return next(new Error('Updater is required.'));
    }

    next();
});

// Error handling middleware for unique constraint violations
publicationSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Publication name already exists.'));
    }

    next(error);
});

publicationSchema.post('findOneAndUpdate', (error, res, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Publication name already exists.'));
    }

    next(error);
});

const PublicationsModel = mongoose.model('Publications', publicationSchema);

export default PublicationsModel;

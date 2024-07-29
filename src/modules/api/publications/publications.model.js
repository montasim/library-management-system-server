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
            required: [true, 'Name cannot be empty.'],
            minlength: [
                publicationsConstants.lengths.NAME_MIN,
                'Name must be at least 3 characters long.',
            ],
            maxlength: [
                publicationsConstants.lengths.NAME_MAX,
                'Name cannot be more than 100 characters long.',
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

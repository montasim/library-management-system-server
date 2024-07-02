import mongoose from 'mongoose';

import publicationsConstants from './publications.constant.js';

const publicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Name cannot be empty.'],
            minlength: [
                publicationsConstants.lengths.NAME_MIN,
                'Name must be at least 3 character long.',
            ],
            maxlength: [
                publicationsConstants.lengths.NAME_MAX,
                'Name cannot be more than 100 characters long.',
            ],
        },
        createdBy: {
            type: String,
            trim: true,
            required: false,
        },
        updatedBy: {
            type: String,
            trim: true,
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-save middleware for creation
publicationSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        next(new Error('Creator is required.'));
    } else {
        next();
    }
});

// Pre-update middleware for updates
publicationSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        next(new Error('Updater is required.'));
    } else {
        next();
    }
});

const PublicationsModel = mongoose.model('Publications', publicationSchema);

export default PublicationsModel;

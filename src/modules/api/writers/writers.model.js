import mongoose from 'mongoose';

import writersConstants from './writers.constant.js';

const { Schema } = mongoose;

const writerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Name cannot be empty.'],
            minlength: [
                writersConstants.lengths.NAME_MIN,
                'Name must be at least 3 character long.',
            ],
            maxlength: [
                writersConstants.lengths.NAME_MAX,
                'Name cannot be more than 100 characters long.',
            ],
        },
        image: {
            fileId: {
                type: String,
                maxlength: [
                    100,
                    'Picture fileId must be less than 100 characters long',
                ],
            },
            shareableLink: {
                type: String,
                maxlength: [
                    500,
                    'Picture shareableLink must be less than 500 characters long',
                ],
            },
            downloadLink: {
                type: String,
                maxlength: [
                    500,
                    'Picture downloadLink must be less than 500 characters long',
                ],
            },
        },
        review: {
            type: Number,
            min: [0, 'Review must be at least 0.'],
            max: [5, 'Review cannot be more than 5.'],
            required: [true, 'Review is required.'],
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Summary is required.'],
            minlength: [
                writersConstants.lengths.SUMMARY_MIN,
                'Summary must be at least 10 characters long.',
            ],
            maxlength: [
                writersConstants.lengths.SUMMARY_MAX,
                'Summary cannot be more than 1000 characters long.',
            ],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
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
writerSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        next(new Error('Creator is required.'));
    } else {
        next();
    }
});

// Pre-update middleware for updates
writerSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        next(new Error('Updater is required.'));
    } else {
        next();
    }
});

const WritersModel = mongoose.model('Writers', writerSchema);

export default WritersModel;

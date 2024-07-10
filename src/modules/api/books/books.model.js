import mongoose from 'mongoose';

import booksConstants from './books.constant.js';

const { Schema } = mongoose;

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Name cannot be empty.'],
            minlength: [
                booksConstants.lengths.NAME_MIN,
                'Name must be at least 3 character long.',
            ],
            maxlength: [
                booksConstants.lengths.NAME_MAX,
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
        bestSeller: {
            type: Number,
            enum: { values: [1], message: 'Best Seller must be 1.' },
            required: false
        },
        review: {
            type: Number,
            min: [0, 'Review must be at least 0.'],
            max: [5, 'Review cannot be more than 5.'],
            required: [true, 'Review is required.'],
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: 'BooksModel',
        },
        subject: [
            {
                type: Schema.Types.ObjectId,
                ref: 'SubjectsModel',
            },
        ],
        publication: {
            type: Schema.Types.ObjectId,
            ref: 'PublicationsModel',
        },
        page: {
            type: Number,
            required: [true, 'Page number is required.'],
        },
        edition: {
            type: String,
            trim: true,
            required: [true, 'Edition is required.'],
            minlength: [
                booksConstants.lengths.EDITION_MIN,
                'Edition name must be at least 1 character long.',
            ],
            maxlength: [
                booksConstants.lengths.EDITION_MAX,
                'Edition name cannot be more than 50 characters long.',
            ],
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Summary is required.'],
            minlength: [
                booksConstants.lengths.SUMMARY_MIN,
                'Summary must be at least 10 characters long.',
            ],
            maxlength: [
                booksConstants.lengths.SUMMARY_MAX,
                'Summary cannot be more than 1000 characters long.',
            ],
        },
        price: {
            type: Number,
            required: [true, 'Price is required.'],
        },
        stockAvailable: {
            type: Number,
            required: [true, 'Stock availability is required.'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            trim: true,
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
        },
        updatedBy: {
            trim: true,
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-save middleware for creation
bookSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        next(new Error('Creator is required.'));
    } else {
        next();
    }
});

// Pre-update middleware for updates
bookSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        next(new Error('Updater is required.'));
    } else {
        next();
    }
});

const BooksModel = mongoose.model('Books', bookSchema);

export default BooksModel;

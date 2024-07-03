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
        bestSeller: {
            type: Number,
            enum: { values: [1], message: 'Best Seller must be 1.' },
            required: [true, 'Best Seller is required.'],
        },
        image: {
            type: String,
            trim: true,
            required: [true, 'Image URL is required.'],
            match: [
                /^https?:\/\/.*\.(jpg|jpeg|png)$/,
                'Please provide a valid URL for an image ending with .jpg, .jpeg, or .png.',
            ],
        },
        review: {
            type: Number,
            min: [0, 'Review must be at least 0.'],
            max: [5, 'Review cannot be more than 5.'],
            required: [true, 'Review is required.'],
        },
        writer: {
            type: Schema.Types.ObjectId,
            ref: 'WritersModel',
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

// Create a unique index on the name field
bookSchema.index({ name: 1 }, { unique: true });

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

// Error handling middleware for unique constraint violations
bookSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Book name already exists.'));
    }

    next(error);
});

bookSchema.post('findOneAndUpdate', (error, res, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Book name already exists.'));
    }

    next(error);
});

const BooksModel = mongoose.model('Books', bookSchema);

export default BooksModel;

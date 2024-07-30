import mongoose, { Schema } from 'mongoose';

import booksConstants from './books.constant.js';
import sharedSchema from '../../../shared/schema.js';

/**
 * Mongoose schema for books.
 * This schema defines the structure and validation criteria for book records,
 * using language that is clear and friendly to all users, with descriptions added for developer clarity.
 */
const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: 'Please enter a unique book name.',
            minlength: [
                booksConstants.lengths.NAME_MIN,
                `The book name should be at least ${booksConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                booksConstants.lengths.NAME_MAX,
                `The book name should not be longer than ${booksConstants.lengths.NAME_MAX} characters.`,
            ],
            description: 'The unique name of the book.',
        },
        image: sharedSchema.imageSchema,
        bestSeller: {
            type: Number,
            min: [
                booksConstants.lengths.BEST_SELLER_MIN,
                `The best seller ranking should be at least ${booksConstants.lengths.BEST_SELLER_MIN}.`,
            ],
            max: [
                booksConstants.lengths.BEST_SELLER_MAX,
                `The best seller ranking should not exceed ${booksConstants.lengths.BEST_SELLER_MAX}.`,
            ],
            integer: true,
            description: `Indicates the best seller ranking of the book, where ${booksConstants.lengths.BEST_SELLER_MAX} is the highest ranking.`,
        },
        review: {
            type: Number,
            min: [
                booksConstants.lengths.REVIEW_MIN,
                `The review rating should be at least ${booksConstants.lengths.REVIEW_MIN}.`,
            ],
            max: [
                booksConstants.lengths.REVIEW_MAX,
                `The review rating should not exceed ${booksConstants.lengths.REVIEW_MAX}.`,
            ],
            validate: {
                validator: Number.isFinite,
                message:
                    'The review rating should be a decimal or whole number.',
            },
            description: `A rating for the book given by readers, from ${booksConstants.lengths.REVIEW_MIN} to ${booksConstants.lengths.REVIEW_MAX}.`,
        },
        writer: {
            type: Schema.Types.ObjectId,
            ref: 'Writers',
            required: 'Please specify the writer of the book.',
            description:
                'The database ID of the writer associated with this book.',
        },
        subject: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Subjects',
                required:
                    'Please include at least one subject related to the book.',
                description:
                    'List of database IDs for subjects associated with the book.',
            },
        ],
        publication: {
            type: Schema.Types.ObjectId,
            ref: 'Publications',
            required: 'Please specify the publication of the book.',
            description:
                'The database ID of the publication that published this book.',
        },
        page: {
            type: Number,
            required: 'Please enter the total number of pages in the book.',
            description: 'Total number of pages in the book.',
        },
        edition: {
            type: String,
            trim: true,
            required: 'Please specify the edition of the book.',
            minlength: [
                booksConstants.lengths.EDITION_MIN,
                `The edition should be at least ${booksConstants.lengths.EDITION_MIN} character long.`,
            ],
            maxlength: [
                booksConstants.lengths.EDITION_MAX,
                `The edition should not be longer than ${booksConstants.lengths.EDITION_MAX} characters.`,
            ],
            description: 'The specific edition of the book, if applicable.',
        },
        summary: {
            type: String,
            trim: true,
            required: 'Please provide a summary of the book.',
            minlength: [
                booksConstants.lengths.SUMMARY_MIN,
                `The summary should be at least ${booksConstants.lengths.SUMMARY_MIN} characters long.`,
            ],
            maxlength: [
                booksConstants.lengths.SUMMARY_MAX,
                `The summary should not exceed ${booksConstants.lengths.SUMMARY_MAX} characters.`,
            ],
            description:
                "A brief description or overview of the book's content.",
        },
        price: {
            type: Number,
            required: 'Please enter the price of the book.',
            description: 'The retail price of the book.',
        },
        stockAvailable: {
            type: Number,
            required:
                'Please specify how many copies of the book are available.',
            description:
                'The number of copies of the book currently in stock and available for purchase.',
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
bookSchema.index({ name: 1 }, { unique: true });

// Pre-save and update middleware
bookSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

// Error handling middleware for unique constraint violations
bookSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Book name already exists.'));
    } else {
        next(error);
    }
});

const BooksModel = mongoose.model('Books', bookSchema);

export default BooksModel;

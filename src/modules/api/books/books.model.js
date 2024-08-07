/**
 * @fileoverview This file defines and exports the Mongoose schema and model for books.
 * The schema includes fields for storing detailed information about books, such as name, image, best seller ranking,
 * review rating, writer, subjects, publication, pages, edition, summary, price, and stock availability.
 * The schema also includes validation criteria and descriptive messages to ensure data integrity.
 */

import mongoose, { Schema } from 'mongoose';

import booksConstants from './books.constant.js';
import sharedSchema from '../../../shared/schema.js';

/**
 * bookSchema - Mongoose schema for storing book details.
 * This schema defines the structure and validation criteria for book records, with descriptions for developer clarity.
 *
 * @typedef {Object} bookSchema
 * @property {String} name - The unique name of the book, required with min and max length constraints.
 * @property {Object} image - Image schema containing the URL, filename, and other image details.
 * @property {Number} bestSeller - The best seller ranking of the book, with min and max value constraints.
 * @property {Number} review - The review rating of the book, with min and max value constraints.
 * @property {Schema.Types.ObjectId} writer - Reference to the writer associated with the book, required.
 * @property {Array<Schema.Types.ObjectId>} subject - List of references to subjects associated with the book, required.
 * @property {Schema.Types.ObjectId} publication - Reference to the publication of the book, required.
 * @property {Number} page - Total number of pages in the book, required.
 * @property {String} edition - The specific edition of the book, required with min and max length constraints.
 * @property {String} summary - A brief description or overview of the book's content, required with min and max length constraints.
 * @property {Number} price - The retail price of the book, required.
 * @property {Number} stockAvailable - The number of copies of the book currently in stock, required.
 * @property {Object} isActive - Boolean flag indicating if the book is active.
 * @property {Object} createdBy - Reference to the admin who created the book record.
 * @property {Object} updatedBy - Reference to the admin who last updated the book record.
 * @property {Date} createdAt - Timestamp for when the book record was created.
 * @property {Date} updatedAt - Timestamp for when the book record was last updated.
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

/**
 * Middleware to enforce that the creator or updater fields are set before saving or updating.
 */
bookSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

/**
 * Middleware to handle unique constraint violations.
 */
bookSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Book name already exists.'));
    } else {
        next(error);
    }
});

const BooksModel = mongoose.model('Books', bookSchema);

export default BooksModel;

/**
 * @fileoverview This file defines and exports the Mongoose schema and model for books history.
 * The schema includes fields for storing the history of books, including lending and returning records.
 * It ensures that all necessary fields are present and sets up relationships with the Books and Users collections.
 */

import mongoose, { Schema } from 'mongoose';

/**
 * booksHistorySchema - Mongoose schema for storing the history of books.
 * Utilizes the booksHistorySchema to define the structure of the documents in the 'BooksHistory' collection.
 *
 * @typedef {Object} booksHistorySchema
 * @property {Schema.Types.ObjectId} book - Reference to the book.
 * @property {Array<Object>} lend - Array of lending records.
 * @property {Schema.Types.ObjectId} lend.user - Reference to the user who borrowed the book.
 * @property {Date} lend.from - Start date of the lending period.
 * @property {Date} lend.to - End date of the lending period.
 * @property {String} lend.remarks - Optional remarks about the lending.
 * @property {Array<Object>} return - Array of return records.
 * @property {Schema.Types.ObjectId} return.user - Reference to the user who returned the book.
 * @property {Date} return.date - Date the book was returned.
 * @property {String} return.remarks - Optional remarks about the return.
 */
const booksHistorySchema = new mongoose.Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Books',
            required: [true, 'Book reference is required.'],
            description:
                'Reference to the book associated with the lending or returning history.',
        },
        lend: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'Users',
                    required: [true, 'User reference for lending is required.'],
                    description: 'Reference to the user who has lent the book.',
                },
                from: {
                    type: Date,
                    required: [true, 'Lending start date is required.'],
                    description: 'The date when the book was lent to the user.',
                },
                to: {
                    type: Date,
                    required: [true, 'Lending end date is required.'],
                    description: 'The expected return date for the lent book.',
                },
                remarks: {
                    type: String,
                    required: [true, 'Remarks for lending are required.'],
                    default: '',
                    description:
                        'Additional comments or remarks about the lending process.',
                },
            },
        ],
        return: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'Users',
                    required: [
                        true,
                        'User reference for returning is required.',
                    ],
                    description: 'Reference to the user who returned the book.',
                },
                date: {
                    type: Date,
                    required: [true, 'Return date is required.'],
                    description:
                        'The date when the book was returned by the user.',
                },
                remarks: {
                    type: String,
                    required: [true, 'Remarks for returning are required.'],
                    default: '',
                    description:
                        'Additional comments or remarks about the return process.',
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for managing the history of books lent and returned by users, including timestamps for automatic tracking of creation and updates. Each record tracks the book, lending details, and return details, allowing for comprehensive management of book circulation in a library system.',
    }
);

const booksHistoryModel = mongoose.model('BooksHistory', booksHistorySchema);

export default booksHistoryModel;

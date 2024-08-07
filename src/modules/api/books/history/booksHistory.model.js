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
        },
        lend: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'Users',
                },
                from: {
                    type: Date,
                    required: true,
                },
                to: {
                    type: Date,
                    required: true,
                },
                remarks: {
                    type: String,
                    default: '',
                },
            },
        ],
        return: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'Users',
                },
                date: {
                    type: Date,
                    required: true,
                },
                remarks: {
                    type: String,
                    default: '',
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

const booksHistoryModel = mongoose.model('BooksHistory', booksHistorySchema);

export default booksHistoryModel;

/**
 * @fileoverview This file defines and exports the Mongoose schema and model for lending books.
 * The schema includes fields for storing the details of books lent by users, including the lending period and any remarks.
 * It ensures that all necessary fields are present and sets up relationships with the Users and Books collections.
 */

import mongoose, { Schema } from 'mongoose';

/**
 * lendBookSchema - Mongoose schema for storing the details of books lent by users.
 * Utilizes the lendBookSchema to define the structure of the documents in the 'LendBooks' collection.
 *
 * @typedef {Object} lendBookSchema
 * @property {Schema.Types.ObjectId} lender - Reference to the user who lent the book.
 * @property {Array<Object>} books - Array of books lent by the user.
 * @property {Schema.Types.ObjectId} books.id - Reference to the book.
 * @property {Date} books.from - Start date of the lending period.
 * @property {Date} books.to - End date of the lending period.
 * @property {String} books.remarks - Optional remarks about the lending.
 */
const lendBookSchema = new mongoose.Schema(
    {
        lender: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        books: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Books',
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
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

const ReturnBooksModel = mongoose.model('LendBooks', lendBookSchema);

export default ReturnBooksModel;

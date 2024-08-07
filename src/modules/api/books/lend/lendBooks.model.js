/**
 * @fileoverview This file defines and exports the Mongoose schema and model for lend books.
 * The schema includes fields for storing information about books lent by users, including details about the lending period and remarks.
 * It ensures that all necessary fields are present and sets up relationships with the Users and Books collections.
 */

import mongoose, { Schema } from 'mongoose';

/**
 * lendBookSchema - Mongoose schema for storing information about books lent by users.
 * Utilizes the lendBookSchema to define the structure of the documents in the 'LendBooks' collection.
 *
 * @typedef {Object} LendBookSchema
 * @property {Schema.Types.ObjectId} lender - Reference to the user who lends the book.
 * @property {Array<Object>} books - Array of books lent.
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

/**
 * Pre-save middleware for creation.
 * Ensures that the lender field is present before saving a new document.
 *
 * @function
 * @param {Function} next - Callback to the next middleware function.
 */
lendBookSchema.pre('save', function (next) {
    if (this.isNew && !this.lender) {
        next(new Error('Lender is required.'));
    } else {
        next();
    }
});

const LendBooksModel = mongoose.model('LendBooks', lendBookSchema);

export default LendBooksModel;

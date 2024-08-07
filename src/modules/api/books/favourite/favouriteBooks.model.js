/**
 * @fileoverview This file defines and exports the Mongoose model for the FavouriteBooks collection.
 * The schema is designed to store user-specific favourite books, including references to user and book documents.
 * The schema includes automatic timestamping for creation and updates, and a pre-save middleware to ensure the owner field is populated.
 */

import mongoose, { Schema } from 'mongoose';

/**
 * favouriteBookSchema - Mongoose schema for storing user-specific favourite books.
 * The schema includes references to user and book documents and ensures automatic timestamping for creation and updates.
 *
 * @typedef {Object} FavouriteBookSchema
 * @property {Schema.Types.ObjectId} owner - Reference to the user who owns the favourite books list.
 * @property {Array<Schema.Types.ObjectId>} favouriteBooks - Array of references to the books marked as favourite by the user.
 */
const favouriteBookSchema = new mongoose.Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        favouriteBooks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Books',
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
 * Pre-save middleware for the favouriteBookSchema.
 * This middleware function runs before a document is saved to the database.
 * It checks if the document is new and if the owner field is populated.
 * If the owner field is not populated, an error is thrown, preventing the document from being saved.
 *
 * @function
 * @param {Function} next - The next middleware function in the stack.
 */
favouriteBookSchema.pre('save', function (next) {
    if (this.isNew && !this.owner) {
        next(new Error('Creator is required.'));
    } else {
        next();
    }
});

/**
 * FavouriteBooksModel - Mongoose model for the FavouriteBooks collection.
 * The model is used to interact with the FavouriteBooks documents in the MongoDB database.
 *
 * @typedef {Object} FavouriteBooksModel
 * @property {Function} pre - Pre-save middleware to ensure the owner field is populated before saving a new document.
 */
const FavouriteBooksModel = mongoose.model(
    'FavouriteBooks',
    favouriteBookSchema
);

export default FavouriteBooksModel;

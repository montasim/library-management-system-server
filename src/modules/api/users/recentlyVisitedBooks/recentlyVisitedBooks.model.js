/**
 * @fileoverview
 * This module defines the Mongoose schema and model for recently visited books.
 * It structures the data model to associate users with their recently visited books.
 * The schema includes references to user and book collections and utilizes Mongoose for schema definition and model creation.
 *
 * The module exports the `recentlyVisitedBooksModel`, which is the Mongoose model for recently visited books.
 */

import mongoose, { Schema } from 'mongoose';

/**
 * Defines the schema for recently visited books.
 *
 * This schema represents the structure of the recently visited books collection in the database.
 * It includes references to the `Users` and `Books` collections, and it automatically manages `createdAt` and `updatedAt` timestamps.
 *
 * @const {Schema} recentlyVisitedBookSchema
 * @property {ObjectId} user - The reference to the user who visited the books.
 * @property {Array} books - An array of book references that the user has recently visited.
 * @property {ObjectId} books.id - The reference to a book in the `Books` collection.
 */
const recentlyVisitedBookSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        books: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Books',
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/**
 * The Mongoose model for recently visited books.
 *
 * This model provides an interface to interact with the `RecentlyVisitedBooks` collection in the MongoDB database,
 * using the defined schema to structure the data.
 *
 * @const {Model} recentlyVisitedBooksModel
 */
const recentlyVisitedBooksModel = mongoose.model(
    'RecentlyVisitedBooks',
    recentlyVisitedBookSchema
);

export default recentlyVisitedBooksModel;

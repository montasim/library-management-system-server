import mongoose, { Schema } from 'mongoose';

import requestBooksConstants from '../books.constant.js';
import sharedSchema from '../../../../shared/schema.js';

/**
 * Book Schema for individual book entries in the requestBooks array.
 */
const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: 'Please enter a unique book name.',
            minlength: [
                requestBooksConstants.lengths.NAME_MIN,
                `The book name should be at least ${requestBooksConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                requestBooksConstants.lengths.NAME_MAX,
                `The book name should not be longer than ${requestBooksConstants.lengths.NAME_MAX} characters.`,
            ],
            description: 'The unique name of the book.',
        },
        image: sharedSchema.imageSchema,
        writer: {
            type: String,
            trim: true,
            required: 'Please specify the writer of the book.',
            description: 'The writer of the book associated with this book.',
        },
        subject: [
            {
                type: String,
                trim: true,
                required: 'Please specify the subject of the book.',
                description: 'The subject(s) associated with this book.',
            },
        ],
        publication: {
            type: String,
            trim: true,
            required: 'Please specify the publication of the book.',
            description: 'The publication associated with this book.',
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
                requestBooksConstants.lengths.EDITION_MIN,
                `The edition should be at least ${requestBooksConstants.lengths.EDITION_MIN} character long.`,
            ],
            maxlength: [
                requestBooksConstants.lengths.EDITION_MAX,
                `The edition should not be longer than ${requestBooksConstants.lengths.EDITION_MAX} characters.`,
            ],
            description: 'The specific edition of the book, if applicable.',
        },
        summary: {
            type: String,
            trim: true,
            required: 'Please provide a summary of the book.',
            minlength: [
                requestBooksConstants.lengths.SUMMARY_MIN,
                `The summary should be at least ${requestBooksConstants.lengths.SUMMARY_MIN} characters long.`,
            ],
            maxlength: [
                requestBooksConstants.lengths.SUMMARY_MAX,
                `The summary should not exceed ${requestBooksConstants.lengths.SUMMARY_MAX} characters.`,
            ],
            description:
                "A brief description or overview of the book's content.",
        },
    },
    {
        timestamps: true, // This enables createdAt and updatedAt for each book entry
    }
);

/**
 * requestBookSchema - Mongoose schema for storing information about requested books.
 */
const requestBookSchema = new mongoose.Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        requestedBooks: [bookSchema], // Use the bookSchema for each book entry
    },
    {
        timestamps: false,
        versionKey: false,
        description:
            'Schema for storing user data with automatic timestamping for each book.',
    }
);

const RequestBooksModel = mongoose.model('RequestBooks', requestBookSchema);

export default RequestBooksModel;

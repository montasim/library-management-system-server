import mongoose, { Schema } from 'mongoose';
import booksConstants from './books.constant.js';

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
        image: {
            fileId: {
                type: String,
                maxlength: [
                    booksConstants.lengths.FILE_ID,
                    `The image file ID should be shorter than ${booksConstants.lengths.FILE_ID} characters.`,
                ],
                description: 'The unique identifier for the book image file.',
            },
            shareableLink: {
                type: String,
                maxlength: [
                    booksConstants.lengths.SHAREABLE_LINK,
                    `The shareable link should be shorter than ${booksConstants.lengths.SHAREABLE_LINK} characters.`,
                ],
                description: 'A URL where the book image can be accessed.',
            },
            downloadLink: {
                type: String,
                maxlength: [
                    booksConstants.lengths.DOWNLOAD_LINK,
                    `The download link should be shorter than ${booksConstants.lengths.DOWNLOAD_LINK} characters.`,
                ],
                description: 'A URL where the book image can be downloaded.',
            },
        },
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
        isActive: {
            type: Boolean,
            default: true,
            description:
                'Indicates whether the book is currently available for purchase.',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'AdminModel',
            required: 'Please specify who created this book entry.',
            description:
                'The database ID of the admin who originally created this book entry.',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'AdminModel',
            required: 'Please specify who last updated this book entry.',
            description:
                'The database ID of the admin who last updated this book entry.',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const BooksModel = mongoose.model('Books', bookSchema);

export default BooksModel;

import mongoose from 'mongoose';

import booksConstants from '../books.constant.js';

const { Schema } = mongoose;

const requestBookSchema = new mongoose.Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        requestBooks: [
            {
                name: {
                    type: String,
                    trim: true,
                    unique: true,
                    required: [true, 'Name cannot be empty.'],
                    minlength: [
                        booksConstants.lengths.NAME_MIN,
                        'Name must be at least 3 character long.',
                    ],
                    maxlength: [
                        booksConstants.lengths.NAME_MAX,
                        'Name cannot be more than 100 characters long.',
                    ],
                },
                image: {
                    type: String,
                    trim: true,
                    required: [true, 'Image URL is required.'],
                    match: [
                        /^https?:\/\/.*\.(jpg|jpeg|png)$/,
                        'Please provide a valid URL for an image ending with .jpg, .jpeg, or .png.',
                    ],
                },
                writer: {
                    type: String,
                    trim: true,
                    required: [true, 'Writer cannot be empty.'],
                },
                subject: [
                    {
                        type: String,
                        trim: true,
                        required: [true, 'Subject cannot be empty.'],
                    },
                ],
                publication: {
                    type: String,
                    trim: true,
                    required: [true, 'Publication cannot be empty.'],
                },
                edition: {
                    type: String,
                    trim: true,
                    required: [true, 'Edition is required.'],
                    minlength: [
                        booksConstants.lengths.EDITION_MIN,
                        'Edition name must be at least 1 character long.',
                    ],
                    maxlength: [
                        booksConstants.lengths.EDITION_MAX,
                        'Edition name cannot be more than 50 characters long.',
                    ],
                },
                summary: {
                    type: String,
                    trim: true,
                    required: [true, 'Summary is required.'],
                    minlength: [
                        booksConstants.lengths.SUMMARY_MIN,
                        'Summary must be at least 10 characters long.',
                    ],
                    maxlength: [
                        booksConstants.lengths.SUMMARY_MAX,
                        'Summary cannot be more than 1000 characters long.',
                    ],
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-save middleware for creation
requestBookSchema.pre('save', function (next) {
    if (this.isNew && !this.owner) {
        next(new Error('Creator is required.'));
    } else {
        next();
    }
});

const RequestBooksModel = mongoose.model('RequestBooks', requestBookSchema);

export default RequestBooksModel;

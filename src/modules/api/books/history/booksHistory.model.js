import mongoose, { Schema } from 'mongoose';

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

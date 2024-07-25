import mongoose from 'mongoose';

const { Schema } = mongoose;

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

const recentlyVisitedBooksModel = mongoose.model(
    'RecentlyVisitedBooks',
    recentlyVisitedBookSchema
);

export default recentlyVisitedBooksModel;

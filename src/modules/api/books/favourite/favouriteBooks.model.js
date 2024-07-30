import mongoose, { Schema } from 'mongoose';

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

// Pre-save middleware for creation
favouriteBookSchema.pre('save', function (next) {
    if (this.isNew && !this.owner) {
        next(new Error('Creator is required.'));
    } else {
        next();
    }
});

const FavouriteBooksModel = mongoose.model(
    'FavouriteBooks',
    favouriteBookSchema
);

export default FavouriteBooksModel;

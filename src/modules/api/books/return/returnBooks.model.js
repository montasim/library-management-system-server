import mongoose from 'mongoose';

const { Schema } = mongoose;

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
    }
);

const ReturnBooksModel = mongoose.model('LendBooks', lendBookSchema);

export default ReturnBooksModel;

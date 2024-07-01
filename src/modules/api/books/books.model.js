import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name cannot be empty'] },
    bestSeller: {
        type: Number,
        enum: { values: [1], message: 'Best Seller must be 1' },
        required: [true, 'Best Seller is required']
    },
    image: { type: String, required: [true, 'Image URL is required'], match: [/^https?:\/\/.*\.(jpg|jpeg|png)$/, 'Please provide a valid URL for an image ending with .jpg, .jpeg, or .png'] },
    review: {
        type: Number,
        min: [0, 'Review must be at least 0'],
        max: [5, 'Review cannot be more than 5'],
        required: [true, 'Review is required']
    },
    writer: { type: String, required: [true, 'Writer name is required'] },
    subject: {
        type: [{ type: String }],
        required: [true, 'At least one subject is required'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'At least one subject must be specified'
        }
    },
    publication: { type: String, required: [true, 'Publication name is required'] },
    page: { type: Number, required: [true, 'Page number is required'] },
    edition: { type: String, required: [true, 'Edition is required'] },
    summary: { type: String, required: [true, 'Summary is required'] },
    price: { type: Number, required: [true, 'Price is required'] },
    stockAvailable: { type: Number, required: [true, 'Stock availability is required'] },
    createdBy: { type: String, required: [true, 'Creator is required'] },
    updatedBy: { type: String }
}, {
    timestamps: true
});

const Books = mongoose.model('Books', bookSchema);

export default Books;

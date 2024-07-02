import httpStatus from '../../../constant/httpStatus.constants.js';
import BooksModel from './books.model.js';

const createBook = async (bookData) => {
    const newBookDoc = await BooksModel.create({
        ...bookData,
        createdBy: 'admin',
    });

    // Convert the Mongoose document to a plain JavaScript object
    const newBook = newBookDoc.toObject();

    const serviceMessage = newBook
        ? 'Book created successfully.'
        : 'Could not create book.';
    const serviceStatus = newBook ? httpStatus.CREATED : httpStatus.NOT_FOUND;

    return {
        timeStamp: new Date(),
        success: true,
        data: newBook,
        message: serviceMessage,
        status: serviceStatus,
    };
};

const getBooks = (req) => {
    return {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Success',
        status: httpStatus.OK,
    };
};

const updateBook = (req) => {
    return {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Success',
        status: httpStatus.OK,
    };
};

const deleteBook = (req) => {
    return {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Success',
        status: httpStatus.OK,
    };
};

const booksService = {
    createBook,
    getBooks,
    updateBook,
    deleteBook,
};

export default booksService;

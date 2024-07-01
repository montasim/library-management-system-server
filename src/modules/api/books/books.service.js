import httpStatus from '../../../constant/httpStatus.constants.js';
import Books from './books.model.js';

const createBook = async (req, bookData) => {
    const book = new Books(bookData);

    return {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: true,
        data: await book.save(),
        message: 'Success',
        status: httpStatus.OK,
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

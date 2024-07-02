import BooksModel from './books.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';

const createBook = async (bookData) => {
    try {
        bookData.createdBy = 'Admin'; // Hardcoded for now, will be dynamic in future

        const newBook = await BooksModel.create(bookData);

        return {
            timeStamp: new Date(),
            success: true,
            data: newBook,
            message: 'Book created successfully.',
            status: httpStatus.CREATED,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error creating the book.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getBooks = async ({
    page = 1,
    limit = 10,
    sort = 'createdAt',
    filter = '',
}) => {
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
    };
    const books = await BooksModel.find({})
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        timeStamp: new Date(),
        success: true,
        data: books,
        message: `${books?.length} ${books?.length > 1 ? 'books' : 'book'} fetched successfully.`,
        status: httpStatus.OK,
    };
};

const getBook = async (bookId) => {
    const book = await BooksModel.findById(bookId);

    if (!book) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Book not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: book,
        message: 'Book fetched successfully.',
        status: httpStatus.OK,
    };
};

const updateBook = async (bookId, updateData) => {
    updateData.updatedBy = 'Admin'; // Hardcoded for now, will be dynamic in future

    const updatedBook = await BooksModel.findByIdAndUpdate(bookId, updateData, {
        new: true,
    });

    if (!updatedBook) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Book not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: updatedBook,
        message: 'Book updated successfully.',
        status: httpStatus.OK,
    };
};

const deleteBooks = async (bookIds) => {
    const results = {
        deleted: [],
        notFound: [],
        failed: [],
    };

    // Process each bookId
    for (const bookId of bookIds) {
        try {
            const book = await BooksModel.findByIdAndDelete(bookId);
            if (book) {
                results.deleted.push(bookId);
            } else {
                results.notFound.push(bookId);
            }
        } catch (error) {
            // Log the error and mark this ID as failed
            logger.error(`Failed to delete book with ID ${bookId}: ${error}`);
            results.failed.push(bookId);
        }
    }

    return {
        timeStamp: new Date(),
        success: results.failed.length === 0, // Success only if there were no failures
        data: results,
        message: `Deleted ${results.deleted.length}, Not found ${results.notFound.length}, Failed ${results.failed.length}`,
        status: httpStatus.OK,
    };
};

const deleteBook = async (bookId) => {
    const book = await BooksModel.findByIdAndDelete(bookId);

    if (!book) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Book not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Book deleted successfully.',
        status: httpStatus.OK,
    };
};

const booksService = {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBooks,
    deleteBook,
};

export default booksService;

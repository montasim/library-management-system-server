import BooksModel from './books.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';

const createBook = async (bookData) => {
    try {
        const oldDetails = await BooksModel.findOne({ name: bookData.name }).lean();

        if (oldDetails) {
            throw new Error(`Book name "${bookData.name}" already exists.`);
        }

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

const getBooks = async (params) => {
    const {
        page = 1,
        limit = 10,
        sort = '-createdAt', // Default sort by most recent creation
        name,
        bestSeller,
        review,
        writer,
        subject,
        publication,
        pageNumber,
        edition,
        summary,
        price,
        stockAvailable,
        createdBy,
        updatedBy,
        ...otherFilters
    } = params;

    const query = {};

    // Constructing query filters based on parameters
    if (name) query.name = { $regex: name, $options: 'i' };
    if (bestSeller) query.bestSeller = bestSeller;
    if (review) query.review = review;
    if (writer) query.writer = { $regex: writer, $options: 'i' };
    if (subject) query.subject = { $in: subject.split(',') };
    if (publication) query.publication = { $regex: publication, $options: 'i' };
    if (pageNumber) query.page = pageNumber;
    if (edition) query.edition = { $regex: edition, $options: 'i' };
    if (summary) query.summary = { $regex: summary, $options: 'i' };
    if (price) query.price = price;
    if (stockAvailable) query.stockAvailable = stockAvailable;
    if (createdBy) query.createdBy = { $regex: createdBy, $options: 'i' };
    if (updatedBy) query.updatedBy = { $regex: updatedBy, $options: 'i' };

    try {
        const totalBooks = await BooksModel.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / limit);

        // Adjust the limit if it exceeds the total number of books
        const adjustedLimit = Math.min(limit, totalBooks - (page - 1) * limit);

        const books = await BooksModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(adjustedLimit);

        return {
            timeStamp: new Date(),
            success: true,
            data: {
                books,
                totalBooks,
                totalPages,
                currentPage: page,
                pageSize: adjustedLimit,
                sort,
            },
            message: books.length
                ? `${books.length} books fetched successfully.`
                : 'No books found.',
            status: httpStatus.OK,
        };
    } catch (error) {
        logger.error('Error fetching books:', error);

        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Failed to fetch books.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
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

import httpStatus from '../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import LendBooksModel from '../lendBooks/lendBooks.model.js';
import BooksHistoryModel from '../booksHistory/booksHistory.model.js';

const returnBook = async (requester, bookData) => {
    try {
        // Step 1: Validate if the requester is authorized
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You are not authorized to return books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        // Step 2: Validate if the book is currently lent by the user
        const lendRecord = await LendBooksModel.findOne({ lender: bookData.user, 'books.id': bookData.bookId });
        if (!lendRecord) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'No lending record found for this book by the specified user.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Find the lend details for the specific book
        const lendDetails = lendRecord.books.find(book => book.id.toString() === bookData.bookId);
        if (!lendDetails) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'No lending record details found for this book by the specified user.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Step 3: Remove the book from the lender's list
        lendRecord.books = lendRecord.books.filter(book => book.id.toString() !== bookData.bookId);
        await lendRecord.save();

        // Step 4: Update the books history with the lend and return details
        let bookHistory = await BooksHistoryModel.findOne({ book: bookData.bookId });
        if (!bookHistory) {
            bookHistory = new BooksHistoryModel({
                book: bookData.bookId,
                lend: [],
                return: [],
            });
        }

        // Add to lend history if not already present
        if (!bookHistory.lend.some(lend => lend.user.toString() === bookData.user)) {
            bookHistory.lend.push({
                user: bookData.user,
                from: lendDetails.from,
                to: lendDetails.to,
                remarks: lendDetails.remarks || '',
            });
        }

        // Add to return history
        bookHistory.return.push({
            user: bookData.user,
            date: new Date(),
            remarks: bookData.remarks || '',
        });

        await bookHistory.save();

        return {
            timeStamp: new Date(),
            success: true,
            data: {},
            message: 'Book returned successfully.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Failed to process your request to return a book.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const writersService = {
    returnBook,
};

export default writersService;

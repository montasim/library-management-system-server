import LendBooksModel from './lendBooks.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import BooksModel from '../books.model.js';

const createLendBook = async (requester, lendBookData) => {
    try {
        // Step 1: Validate if the requester is authorized
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You are not authorized to add lend books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        // Step 2: Validate if the book exists
        const bookDetails = await BooksModel.findById(lendBookData.bookId);
        if (!bookDetails) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'No book found with the provided ID.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Step 3: Check if the book is already lent by someone else
        const isBookLent = await LendBooksModel.findOne({
            'books.id': lendBookData.bookId,
        });
        if (isBookLent) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'This book is already lent by someone else.',
                status: httpStatus.CONFLICT,
            };
        }

        // Step 4: Validate the 'from' and 'to' dates
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to the start of the day

        const fromDate = new Date(lendBookData.from);
        const toDate = new Date(lendBookData.to);

        if (fromDate < today) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'The "from" date cannot be earlier than today.',
                status: httpStatus.BAD_REQUEST,
            };
        }

        const maxToDate = new Date(fromDate);
        maxToDate.setDate(fromDate.getDate() + 30); // Adding 30 days to 'from' date

        if (toDate > maxToDate) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message:
                    'The "to" date cannot be more than 30 days from the "from" date.',
                status: httpStatus.BAD_REQUEST,
            };
        }

        // Step 5: Find existing document for the user or create a new one
        const existingLend = await LendBooksModel.findOne({
            lender: requester,
        });
        if (existingLend) {
            // Prevent adding duplicate book IDs
            if (
                existingLend.books.some(
                    (book) => book.id.toString() === lendBookData.bookId
                )
            ) {
                return {
                    timeStamp: new Date(),
                    success: false,
                    data: {},
                    message: 'This book is already in your lend list.',
                    status: httpStatus.CONFLICT,
                };
            }

            existingLend.books.push({
                id: lendBookData.bookId,
                from: lendBookData.from,
                to: lendBookData.to,
                remarks: lendBookData.remarks || '',
            });
            await existingLend.save();

            return {
                timeStamp: new Date(),
                success: true,
                data: existingLend,
                message: 'You have lent the book successfully.',
                status: httpStatus.OK,
            };
        } else {
            // Create a new document if none exists
            const newLendBook = await LendBooksModel.create({
                lender: requester,
                books: [
                    {
                        id: lendBookData.bookId,
                        from: lendBookData.from,
                        to: lendBookData.to,
                        remarks: lendBookData.remarks || '',
                    },
                ],
            });

            return {
                timeStamp: new Date(),
                success: true,
                data: newLendBook,
                message: 'Book added to your lend list.',
                status: httpStatus.CREATED,
            };
        }
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message:
                error.message ||
                'Failed to process your request to add a lend book.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getLendBooks = async (requester) => {
    try {
        // Step 1: Validate if the requester is authorized
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You are not authorized to get lend books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        // Step 2: Fetch the lend books for the requester
        const lendBooks = await LendBooksModel.findOne({
            lender: requester,
        }).populate({
            path: 'books.id',
            select: '-bestSeller -review -price -stockAvailable -createdBy -createdAt -updatedAt',
            populate: [
                {
                    path: 'subject',
                    model: 'Subjects',
                    select: 'name -_id',
                },
                {
                    path: 'publication',
                    model: 'Publications',
                    select: 'name -_id',
                },
            ],
        });

        // Step 3: Check if the requester has any lend books
        if (!lendBooks || lendBooks.books.length === 0) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You have no lend books.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Step 4: Transform the data to rename 'id' to 'book'
        const transformedLendBooks = lendBooks.books.map((bookEntry) => ({
            ...bookEntry._doc,
            book: bookEntry.id,
            id: bookEntry._id,
        }));

        // Step 5: Return the lend books with the transformed structure
        return {
            timeStamp: new Date(),
            success: true,
            data: {
                total: transformedLendBooks.length,
                lendBooks: transformedLendBooks,
            },
            message: 'Successfully retrieved your lend books.',
            status: httpStatus.OK,
        };
    } catch (error) {
        // Step 6: Handle any errors that occur during the process
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Failed to retrieve lend books.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const writersService = {
    createLendBook,
    getLendBooks,
};

export default writersService;

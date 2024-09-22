/**
 * @fileoverview This file defines and exports the services related to lending books.
 * It includes functions for creating a lend book record and retrieving lend books for a requester.
 * These services interact with the database models to perform the necessary operations and return appropriate responses.
 */

import LendBooksModel from './lendBooks.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import BooksModel from '../books.model.js';
import UsersModel from '../../users/users.model.js';
import loggerService from '../../../../service/logger.service.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

/**
 * createLendBook - Service function to create a new lend book record.
 * This function validates the input data, checks for existing lend records, and saves the new record to the database.
 *
 * @param {ObjectId} requester - The ID of the user making the request.
 * @param {Object} lendBookData - The data for the lend book record.
 * @returns {Promise<Object>} - The response object containing the status and data or error message.
 */
const createLendBook = async (requester, lendBookData) => {
    try {
        const lenderDetails = await UsersModel.findById(lendBookData.user);
        if (!lenderDetails) {
            return errorResponse(
                'No user found with the provided ID.',
                httpStatus.NOT_FOUND
            );
        }

        const bookDetails = await BooksModel.findById(lendBookData.book);
        if (!bookDetails) {
            return errorResponse(
                'No book found with the provided ID.',
                httpStatus.NOT_FOUND
            );
        }

        // Step 3: Check if the book is already lent by someone else
        const isBookLent = await LendBooksModel.findOne({
            'books.id': lendBookData.book,
        });
        if (isBookLent) {
            return errorResponse(
                'This book is already lent by someone else.',
                httpStatus.CONFLICT
            );
        }

        // Step 4: Validate the 'from' and 'to' dates
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to the start of the day

        const fromDate = new Date();
        const toDate = new Date(lendBookData.to);

        if (fromDate < today) {
            return errorResponse(
                'The "from" date cannot be earlier than today.',
                httpStatus.BAD_REQUEST
            );
        }

        const maxToDate = new Date(fromDate);
        maxToDate.setDate(fromDate.getDate() + 30); // Adding 30 days to 'from' date

        if (toDate > maxToDate) {
            return errorResponse(
                'The "to" date cannot be more than 30 days from the "from" date.',
                httpStatus.BAD_REQUEST
            );
        }

        lendBookData.from = fromDate; // Update the 'to' date to the validated value
        // Step 5: Find existing document for the user or create a new one
        const existingLend = await LendBooksModel.findOne({
            lender: lendBookData.user,
        });
        if (existingLend) {
            // Prevent adding duplicate book IDs
            if (
                existingLend.books.some(
                    (book) => book.id.toString() === lendBookData.book
                )
            ) {
                return errorResponse(
                    'This book is already in your lend list.',
                    httpStatus.CONFLICT
                );
            }

            existingLend.books.push({
                id: lendBookData.book,
                from: lendBookData.from,
                to: lendBookData.to,
                remarks: lendBookData.remarks || '',
            });
            await existingLend.save();

            return sendResponse(
                existingLend,
                'You have lent the book successfully.',
                httpStatus.OK
            );
        } else {
            // Create a new document if none exists
            const newLendBook = await LendBooksModel.create({
                lender: lendBookData.user,
                books: [
                    {
                        id: lendBookData.book,
                        from: lendBookData.from,
                        to: lendBookData.to,
                        remarks: lendBookData.remarks || '',
                    },
                ],
            });

            return sendResponse(
                newLendBook,
                'Book added to your lend list.',
                httpStatus.CREATED
            );
        }
    } catch (error) {
        loggerService.error(`Failed to lend book: ${error}`);

        return errorResponse(
            error.message || 'Failed to lend book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * getLendBooks - Service function to retrieve lend books for a requester.
 * This function fetches the lend books data from the database and transforms the data for the response.
 *
 * @param {ObjectId} requester - The ID of the user making the request.
 * @returns {Promise<Object>} - The response object containing the status and data or error message.
 */
// const getLendBooks = async (requester) => {
//     try {
//         // Step 2: Fetch the lend books for the requester
//         const lendBooks = await LendBooksModel.findOne({
//             lender: requester,
//         }).populate({
//             path: 'books.id',
//             select: '-bestSeller -review -price -stockAvailable -createdBy -createdAt -updatedAt',
//             populate: [
//                 {
//                     path: 'subject',
//                     model: 'Subjects',
//                     select: 'name -_id',
//                 },
//                 {
//                     path: 'publication',
//                     model: 'Publications',
//                     select: 'name -_id',
//                 },
//             ],
//         });
//
//         // Step 3: Check if the requester has any lend books
//         if (!lendBooks || lendBooks.books.length === 0) {
//             return errorResponse(
//                 'You have no lend books.',
//                 httpStatus.NOT_FOUND
//             );
//         }
//
//         // Step 4: Transform the data to rename 'id' to 'book'
//         const transformedLendBooks = lendBooks.books.map((bookEntry) => ({
//             ...bookEntry._doc,
//             book: bookEntry.id,
//             id: bookEntry._id,
//         }));
//
//         // Step 5: Return the lend books with the transformed structure
//         return sendResponse(
//             {
//                 total: transformedLendBooks.length,
//                 lendBooks: transformedLendBooks,
//             },
//             'Successfully retrieved your lend books.',
//             httpStatus.OK
//         );
//     } catch (error) {
//         loggerService.error(`Failed to get lend book: ${error}`);
//
//         return errorResponse(
//             error.message || 'Failed to get lend book.',
//             httpStatus.INTERNAL_SERVER_ERROR
//         );
//     }
// };

const getLendBooks = async () => {
    try {
        // Fetch lend books grouped by lender, populating the book details automatically
        const lendBooksGrouped = await LendBooksModel.find()
            .populate({
                path: 'books.id',
                select: '-bestSeller -review -price -stockAvailable -createdBy -createdAt -updatedAt', // Select the fields you want to include/exclude
                populate: [
                    {
                        path: 'subject',
                        model: 'Subjects',
                        select: 'name -_id', // Populating subject details
                    },
                    {
                        path: 'publication',
                        model: 'Publications',
                        select: 'name -_id', // Populating publication details
                    }
                ]
            })
            .populate({
                path: 'lender',
                model: 'Users', // Assuming 'Users' collection holds the lender information
                select: 'name email', // Include necessary lender details
            });

        // Step 3: Check if there are any lend books
        if (!lendBooksGrouped || lendBooksGrouped.length === 0) {
            return errorResponse(
                'No lend books found.',
                httpStatus.NOT_FOUND
            );
        }

        // Step 4: Transform the data into the desired format
        const responseData = lendBooksGrouped.map((lendGroup) => ({
            lender: {
                _id: lendGroup.lender._id,
                name: lendGroup.lender.name,
                email: lendGroup.lender.email, // Include other lender details as needed
            },
            totalLend: lendGroup.books.length,
            books: lendGroup.books.map(book => ({
                _id: book.id._id,
                name: book.id.name,
                subject: book.id.subject?.name, // If the subject is populated
                publication: book.id.publication?.name, // If the publication is populated
                bestSeller: book.id.bestSeller,
                review: book.id.review,
                price: book.id.price,
                stockAvailable: book.id.stockAvailable,
                edition: book.id.edition,
                summary: book.id.summary,
                page: book.id.page,
                image: book.id.image, // If there is an image associated
                createdAt: book.id.createdAt,
                updatedAt: book.id.updatedAt,
                from: book.from,  // Adding from date
                to: book.to,      // Adding to date
                remarks: book.remarks,  // Adding remarks field
            }))
        }));

        // Step 5: Return the grouped lend books
        return sendResponse(
            {
                totalLender: responseData.length,
                totalLend: responseData.reduce((sum, group) => sum + group.totalLend, 0),
                details: responseData,
            },
            'Successfully retrieved lend books grouped by lender.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get lend books grouped by lender: ${error}`);

        return errorResponse(
            error.message || 'Failed to get lend books grouped by lender.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * writersService - An object that holds the services for lending books.
 * These services include creating a lend book record and retrieving lend books for a requester.
 *
 * @typedef {Object} WritersService
 * @property {Function} createLendBook - Service function to create a new lend book record.
 * @property {Function} getLendBooks - Service function to retrieve lend books for a requester.
 */
const writersService = {
    createLendBook,
    getLendBooks,
};

export default writersService;

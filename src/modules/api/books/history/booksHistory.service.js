import httpStatus from '../../../../constant/httpStatus.constants.js';
import BooksHistoryModel from './booksHistory.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import loggerService from '../../../../service/logger.service.js';

const getBooksHistory = async (params) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt', // Default sort by most recent creation
            bookId,
            user,
            from,
            to,
            ...otherFilters
        } = params;

        const query = {};

        // Constructing query filters based on parameters
        if (bookId) query.book = bookId;
        if (user) query['lend.user'] = user;
        if (from) query['lend.from'] = { $gte: new Date(from) };
        if (to) query['lend.to'] = { $lte: new Date(to) };

        // Step 2: Fetch the books history based on the query
        const totalHistory = await BooksHistoryModel.countDocuments(query);
        const totalPages = Math.ceil(totalHistory / limit);

        // Adjust the limit if it exceeds the total number of history records
        const adjustedLimit = Math.min(
            limit,
            totalHistory - (page - 1) * limit
        );

        const booksHistory = await BooksHistoryModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(adjustedLimit)
            .populate({
                path: 'book',
                select: '-createdBy -updatedBy',
                populate: [
                    {
                        path: 'writer',
                        model: 'Writers',
                        select: '-createdBy -updatedBy',
                    },
                    {
                        path: 'subject',
                        model: 'Subjects',
                        select: '-createdBy -updatedBy',
                    },
                    {
                        path: 'publication',
                        model: 'Publications',
                        select: '-createdBy -updatedBy',
                    },
                ],
            })
            .populate({
                path: 'lend.user return.user',
                select: 'name email', // Adjust fields as necessary
            });

        if (!booksHistory || booksHistory.length === 0) {
            return errorResponse(
                'No books history found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {
                booksHistory,
                totalHistory,
                totalPages,
                currentPage: page,
                pageSize: adjustedLimit,
                sort,
            },
            booksHistory.length
                ? `${booksHistory.length} books history records fetched successfully.`
                : 'No books history found.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get book history: ${error}`);

        return errorResponse(
            error.message || 'Failed to get book history.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getBookHistory = async (bookId) => {
    try {
        const bookHistory = await BooksHistoryModel.findOne({ book: bookId });
        if (!bookHistory) {
            return errorResponse(
                'No books history found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            bookHistory,
            'Successfully retrieved book history.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get book history: ${error}`);

        return errorResponse(
            error.message || 'Failed to get book history.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const writersService = {
    getBooksHistory,
    getBookHistory,
};

export default writersService;

/**
 * @fileoverview This file defines and exports the service functions for managing books.
 * These services include functions for creating, retrieving, updating, and deleting books.
 * The functions handle validation, image uploads, and database operations, ensuring data integrity
 * and proper handling of related entities such as writers, subjects, and publications.
 */

import { v2 as cloudinary } from 'cloudinary';

import BooksModel from './books.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import mimeTypesConstants from '../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../constant/fileExtensions.constants.js';
import booksConstant from './books.constant.js';
import SubjectsModel from '../subjects/subjects.model.js';
import PublicationsModel from '../publications/publications.model.js';
import WritersModel from '../writers/writers.model.js';
import TranslatorsModel from '../translators/translators.model.js';
import loggerService from '../../../service/logger.service.js';
import service from '../../../shared/service.js';
import AdminActivityLoggerModel from '../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants from '../admin/adminActivityLogger/adminActivityLogger.constants.js';
import configuration from '../../../configuration/configuration.js';

import isEmptyObject from '../../../utilities/isEmptyObject.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import validateFile from '../../../utilities/validateFile.js';

cloudinary.config({
    cloud_name: configuration.cloudinary.cloudName,
    api_key: configuration.cloudinary.apiKey,
    api_secret: configuration.cloudinary.apiSecret,
});

/**
 * Helper function to validate IDs for writer and publication.
 *
 * @param {string} writer - Writer ID to validate.
 * @param {string} translator - Translator ID to validate.
 * @param {string} publication - Publication ID to validate.
 * @returns {Array<string>} - An array of error messages, if any.
 */
const validateIds = async (writer, translator, publication) => {
    const errors = [];

    // Validate writer
    if (writer && !(await WritersModel.exists(writer))) {
        errors.push(`Invalid writer ID: ${writer}`);
    }

    // Validate writer
    if (translator && !(await TranslatorsModel.exists(translator))) {
        errors.push(`Invalid translator ID: ${translator}`);
    }

    // Validate publication
    if (publication && !(await PublicationsModel.exists(publication))) {
        errors.push(`Invalid publication ID: ${publication}`);
    }

    return errors;
};

/**
 * Helper function to validate subject IDs.
 *
 * @param {Array<string>} subjectIds - Array of subject IDs to validate.
 * @returns {Array<string>} - An array of error messages, if any.
 */
const validateSubjectIds = async (subjectIds) => {
    const subjectErrors = [];

    if (subjectIds?.length) {
        for (const subjectId of subjectIds) {
            if (!(await SubjectsModel.findById(subjectId))) {
                subjectErrors.push(`Invalid subject ID: ${subjectId}`);
            }
        }
    }

    return subjectErrors;
};

/**
 * Helper function to populate book fields with related data.
 *
 * @param {Object} query - Mongoose query object.
 * @returns {Promise<Object>} - Populated query result.
 */
const populateBookFields = async (query) => {
    return await query
        .populate({
            path: 'writer',
            select: '-createdBy -updatedBy',
        })
        .populate({
            path: 'translator',
            select: '-createdBy -updatedBy',
        })
        .populate({
            path: 'publication',
            select: '-createdBy -updatedBy',
        })
        .populate({
            path: 'subject',
            select: '-createdBy -updatedBy',
        })
        .select('-createdBy -updatedBy');
};

const bookListParamsMapping = {
    bookPage: 'page', // Mapping 'bookPage' from the API to 'page' in the database
};

/**
 * Creates a new book in the database with image upload and detailed data validation.
 *
 * @param {string} requester - The ID of the user requesting the creation, used to verify admin permissions.
 * @param {Object} bookData - The data of the book to be created. Should include fields like name, writer, publication, etc.
 * @param {Object} bookImage - The image file associated with the book, which will be uploaded to Google Drive.
 * @returns {Promise<Object>} - A promise that resolves to the response object indicating the result of the operation.
 */
const createNewBook = async (requester, bookData, bookImage) => {
    try {
        // Check if book name already exists
        const exists = await BooksModel.findOne({
            name: bookData.name,
        }).lean();
        if (exists) {
            return sendResponse(
                {},
                `Books name "${bookData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        // Validate writer, publication, and subject IDs
        const validationErrors = [
            ...(await validateIds(
                bookData.writer,
                bookData.translator,
                bookData.publication
            )),
            ...(await validateSubjectIds(bookData.subject)),
        ];
        if (validationErrors.length) {
            return sendResponse(
                {},
                validationErrors.join(' '),
                httpStatus.BAD_REQUEST
            );
        }

        // Validate the image file
        if (!bookImage) {
            return errorResponse(
                'Please provide an image.',
                httpStatus.BAD_REQUEST
            );
        }

        const fileValidationResults = validateFile(
            bookImage,
            booksConstant.imageSize,
            [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
            [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
        );
        if (!fileValidationResults.isValid) {
            return errorResponse(
                fileValidationResults.message,
                httpStatus.BAD_REQUEST
            );
        }

        const file = bookImage;
        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            {
                folder: 'library-management-system-server',
                public_id: file.originalname,
            }
        );

        // Update image data in update object
        bookData.image = {
            fileId: result?.asset_id,
            shareableLink: result?.secure_url,
            downloadLink: result.url,
        };

        // Create the book
        const newBook = await BooksModel.create(bookData);

        // Update booksCount of associated subjects, writers, and publications concurrently
        await Promise.all([
            // Update booksCount of associated subjects
            Promise.all(
                bookData.subject.map((subjectId) =>
                    SubjectsModel.findByIdAndUpdate(
                        subjectId,
                        {
                            $inc: { booksCount: 1 },
                        },
                        { new: true, runValidators: true }
                    )
                )
            ),

            // Update booksCount of associated writers
            WritersModel.updateMany(
                { _id: { $in: bookData.writer } },
                {
                    $inc: { booksCount: 1 },
                },
                { new: true, runValidators: true }
            ),

            // Update booksCount of associated writers
            bookData?.translator &&
                TranslatorsModel.updateMany(
                    { _id: { $in: bookData.translator } },
                    {
                        $inc: { booksCount: 1 },
                    },
                    { new: true, runValidators: true }
                ),

            // Update booksCount of associated publications
            PublicationsModel.updateMany(
                { _id: { $in: bookData.publication } },
                {
                    $inc: { booksCount: 1 },
                },
                { new: true, runValidators: true }
            ),
        ]);

        // Get the populated book data
        const newBookDetails = await populateBookFields(
            BooksModel.findById(newBook._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${bookData.name} created successfully.`,
            details: JSON.stringify(newBookDetails),
        });

        // Send success response
        return sendResponse(
            newBookDetails,
            'Book created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create book: ${error}`);

        return errorResponse(
            error.message || 'Failed to create book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Retrieves a list of books from the database based on query parameters.
 *
 * @param {Object} params - Query parameters for filtering and pagination.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the list of books.
 */
const getBookList = async (params) => {
    try {
        const {
            page, // No default value, check if it's provided
            limit = 10,
            sort = '-createdAt',
            requester,
            categories, // Filters by subjects
            writers, // Filters by writer
            publications, // Filters by publication
            ...restParams
        } = params;

        // Dynamic query construction with mapping for other fields
        const query = Object.keys(restParams).reduce((acc, key) => {
            if (restParams[key] !== undefined && restParams[key] !== '') {
                const schemaKey = bookListParamsMapping[key] || key; // Use mapped key if available, otherwise use the key as is
                // Apply regex pattern for text search fields
                if (['name', 'createdBy', 'updatedBy'].includes(schemaKey)) {
                    acc[schemaKey] = new RegExp(restParams[key], 'i'); // Handle text search using regex
                } else {
                    acc[schemaKey] = restParams[key]; // Direct assignment for other fields
                }
            }
            return acc;
        }, {});

        // Filter by categories (subjects), writers, and publications only if they are not empty
        if (categories && categories.trim() !== '') {
            query.subject = { $in: categories.split(',').map((c) => c.trim()) }; // subjects (categories) are stored as an array of ObjectIds
        }
        if (writers && writers.trim() !== '') {
            query.writer = { $in: writers.split(',').map((w) => w.trim()) }; // writer is a single ObjectId
        }
        if (publications && publications.trim() !== '') {
            query.publication = {
                $in: publications.split(',').map((p) => p.trim()),
            }; // publication is a single ObjectId
        }

        // Get total items count based on the query
        const totalItems = await BooksModel.countDocuments(query);

        // Conditionally apply pagination if `page` is provided, else return all data
        let itemsQuery = BooksModel.find(query).sort(sort);

        if (page) {
            const totalPages = Math.ceil(totalItems / limit);
            itemsQuery = itemsQuery.skip((page - 1) * limit).limit(limit);

            const items = await populateBookFields(itemsQuery);

            if (!items.length) {
                return sendResponse({}, `No books found.`, httpStatus.OK);
            }

            return sendResponse(
                {
                    items,
                    totalItems,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                    sort,
                },
                `${items.length} books fetched successfully.`,
                httpStatus.OK
            );
        } else {
            // If no page is provided, return all data without pagination
            const items = await populateBookFields(itemsQuery);

            if (!items.length) {
                return sendResponse({}, `No books found.`, httpStatus.OK);
            }

            return sendResponse(
                {
                    items,
                    totalItems,
                    sort,
                },
                `${items.length} books fetched successfully.`,
                httpStatus.OK
            );
        }
    } catch (error) {
        loggerService.error(`Failed to get books: ${error}`);

        return errorResponse(
            error.message || `Failed to get books.`,
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Retrieves a book by its ID from the database.
 *
 * @param {string} bookId - The ID of the book to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the book details.
 */
const getBookById = async (bookId) => {
    return service.getResourceById(
        BooksModel,
        populateBookFields,
        bookId,
        'Book'
    );
};

/**
 * Updates an existing book record with new data and possibly a new image.
 *
 * @param {string} requester - The ID of the user making the update request.
 * @param {string} bookId - The ID of the book to update.
 * @param {Object} updateData - Data to update the book with.
 * @param {Object} bookImage - New image for the book, if provided.
 * @returns {Promise<Object>} - The updated book details or an error response.
 */
const updateBookById = async (requester, bookId, updateData, bookImage) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        const { writer, translator, addSubject, deleteSubject, publication } =
            updateData;
        const errors = await validateIds(writer, translator, publication);

        if (errors.length) {
            return errorResponse(errors.join(' '), httpStatus.BAD_REQUEST);
        }

        const addSubjectErrors = await validateSubjectIds(addSubject);
        const deleteSubjectErrors = await validateSubjectIds(deleteSubject);

        if (addSubjectErrors.length || deleteSubjectErrors.length) {
            return errorResponse(
                [...addSubjectErrors, ...deleteSubjectErrors].join(' '),
                httpStatus.BAD_REQUEST
            );
        }

        // Ensure no overlap between addSubject and deleteSubject
        if (addSubject && deleteSubject) {
            const overlappingSubjects = addSubject.filter((subject) =>
                deleteSubject.includes(subject)
            );
            if (overlappingSubjects.length) {
                return errorResponse(
                    `The following subjects are in both addSubject and deleteSubject: ${overlappingSubjects.join(', ')}`,
                    httpStatus.BAD_REQUEST
                );
            }
        }

        // Find the current book
        const book = await BooksModel.findById(bookId);

        if (!book) {
            return errorResponse('Book not found.', httpStatus.NOT_FOUND);
        }

        // Ensure book.subject is an array
        if (!Array.isArray(book.subject)) {
            book.subject = [];
        }

        const existingSubjects = [];
        const newSubjects = [];

        // Handle adding subjects
        if (addSubject?.length) {
            addSubject.forEach((subject) => {
                if (book.subject.includes(subject)) {
                    existingSubjects.push(subject);
                } else {
                    newSubjects.push(subject);
                }
            });

            if (existingSubjects.length) {
                return errorResponse(
                    `The following subjects already exist: ${existingSubjects.join(', ')}`,
                    httpStatus.BAD_REQUEST
                );
            }

            // Increment booksCount for new subjects
            await Promise.all(
                newSubjects.map((subjectId) =>
                    SubjectsModel.findByIdAndUpdate(
                        subjectId,
                        {
                            $inc: { booksCount: 1 },
                        },
                        { new: true, runValidators: true }
                    )
                )
            );

            book.subject.push(...newSubjects);
        }

        // Handle deleting subjects
        if (deleteSubject && deleteSubject.length) {
            // Decrement booksCount for deleted subjects
            await Promise.all(
                deleteSubject.map((subjectId) =>
                    SubjectsModel.findByIdAndUpdate(
                        subjectId,
                        {
                            $inc: { booksCount: -1 },
                        },
                        { new: true, runValidators: true }
                    )
                )
            );

            book.subject = book.subject.filter(
                (subject) => !deleteSubject.includes(subject.toString())
            );
        }

        // Update booksCount for writer if it is being updated
        if (writer && writer.toString() !== book.writer.toString()) {
            await Promise.all([
                // Decrement booksCount of the old writer
                WritersModel.findByIdAndUpdate(
                    book.writer,
                    {
                        $inc: { booksCount: -1 },
                    },
                    { new: true, runValidators: true }
                ),

                // Increment booksCount of the new writer
                WritersModel.findByIdAndUpdate(
                    writer,
                    {
                        $inc: { booksCount: 1 },
                    },
                    { new: true, runValidators: true }
                ),
            ]);
            book.writer = writer;
        }

        // Update booksCount for publication if it is being updated
        if (
            publication &&
            publication.toString() !== book.publication.toString()
        ) {
            await Promise.all([
                // Decrement booksCount of the old publication
                PublicationsModel.findByIdAndUpdate(
                    book.publication,
                    {
                        $inc: { booksCount: -1 },
                    },
                    { new: true, runValidators: true }
                ),

                // Increment booksCount of the new publication
                PublicationsModel.findByIdAndUpdate(
                    publication,
                    {
                        $inc: { booksCount: 1 },
                    },
                    { new: true, runValidators: true }
                ),
            ]);
            book.publication = publication;
        }

        // Update other fields
        const {
            addSubject: _,
            deleteSubject: __,
            ...otherUpdates
        } = updateData;

        Object.assign(book, otherUpdates);

        // Handle file update
        if (bookImage) {
            const fileValidationResults = validateFile(
                bookImage,
                booksConstant.imageSize,
                [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
                [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
            );
            if (!fileValidationResults.isValid) {
                return errorResponse(
                    fileValidationResults.message,
                    httpStatus.BAD_REQUEST
                );
            }

            const file = bookImage;
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                {
                    folder: 'library-management-system-server',
                    public_id: file.originalname,
                }
            );

            // Update image data in update object
            const bookImageData = {
                fileId: result?.asset_id,
                shareableLink: result?.secure_url,
                downloadLink: result.url,
            };

            if (bookImageData) {
                updateData.image = bookImageData;
            }
        }

        await book.save();

        const updatedBookDetails = await populateBookFields(
            BooksModel.findById(bookId)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${bookId} updated successfully.`,
            details: JSON.stringify(updatedBookDetails),
            affectedId: bookId,
        });

        return sendResponse(
            updatedBookDetails,
            'Book updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update book: ${error}`);

        return errorResponse(
            error.message || 'Failed to update book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Deletes a book by its ID from the database.
 *
 * @param {string} requester - The ID of the user making the delete request.
 * @param {string} bookId - The ID of the book to delete.
 * @returns {Promise<Object>} - A promise that resolves to the response object indicating the result of the operation.
 */
const deleteBookById = async (requester, bookId) => {
    try {
        // Find the book by ID
        const book = await BooksModel.findById(bookId);

        if (!book) {
            return errorResponse('Book not found.', httpStatus.NOT_FOUND);
        }

        // Decrement booksCount for associated subjects, writer, and publication
        await Promise.all([
            // Decrement booksCount of associated subjects
            Promise.all(
                book.subject.map((subjectId) =>
                    SubjectsModel.findByIdAndUpdate(
                        subjectId,
                        {
                            $inc: { booksCount: -1 },
                        },
                        { new: true, runValidators: true }
                    )
                )
            ),

            // Decrement booksCount of the associated writer
            WritersModel.findByIdAndUpdate(
                book.writer,
                {
                    $inc: { booksCount: -1 },
                },
                { new: true, runValidators: true }
            ),

            // Decrement booksCount of the associated translator
            TranslatorsModel.findByIdAndUpdate(
                book.translator,
                {
                    $inc: { booksCount: -1 },
                },
                { new: true, runValidators: true }
            ),

            // Decrement booksCount of the associated publication
            PublicationsModel.findByIdAndUpdate(
                book.publication,
                {
                    $inc: { booksCount: -1 },
                },
                { new: true, runValidators: true }
            ),
        ]);

        // Delete the book
        await BooksModel.findByIdAndDelete(bookId);

        // Log the deletion action
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: `Book with ID ${bookId} deleted successfully.`,
            details: JSON.stringify({ bookId, bookName: book.name }),
            affectedId: bookId,
        });

        // Send success response
        return sendResponse({}, 'Book deleted successfully.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to delete book: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Deletes multiple books from the database based on a list of book IDs.
 *
 * @param {string} requester - The ID of the user making the delete request.
 * @param {Array<string>} bookIds - The list of book IDs to delete.
 * @returns {Promise<Object>} - A promise that resolves to the response object indicating the result of the operation.
 */
const deleteBookList = async (requester, bookIds) => {
    try {
        if (!bookIds || !bookIds.length) {
            return errorResponse(
                'Please provide book IDs.',
                httpStatus.BAD_REQUEST
            );
        }

        // Find all books by the provided IDs
        const books = await BooksModel.find({ _id: { $in: bookIds } });

        if (!books.length) {
            return errorResponse(
                'No books found for the provided IDs.',
                httpStatus.NOT_FOUND
            );
        }

        // Collect associated subject, writer, and publication IDs to update
        const subjectIds = [];
        const writerIds = new Set();
        const translatorIds = new Set();
        const publicationIds = new Set();

        books.forEach((book) => {
            if (book.subject && Array.isArray(book.subject)) {
                subjectIds.push(...book.subject);
            }
            if (book.writer) {
                writerIds.add(book.writer.toString());
            }
            if (book.translator) {
                translatorIds.add(book.translator.toString());
            }
            if (book.publication) {
                publicationIds.add(book.publication.toString());
            }
        });

        // Decrement booksCount for associated subjects, writers, and publications
        await Promise.all([
            // Decrement booksCount for subjects
            Promise.all(
                subjectIds.map((subjectId) =>
                    SubjectsModel.findByIdAndUpdate(
                        subjectId,
                        {
                            $inc: { booksCount: -1 },
                        },
                        { new: true, runValidators: true }
                    )
                )
            ),

            // Decrement booksCount for writers
            WritersModel.updateMany(
                { _id: { $in: Array.from(writerIds) } },
                {
                    $inc: { booksCount: -1 },
                },
                { new: true, runValidators: true }
            ),

            // Decrement booksCount for translators
            TranslatorsModel.updateMany(
                { _id: { $in: Array.from(translatorIds) } },
                {
                    $inc: { booksCount: -1 },
                },
                { new: true, runValidators: true }
            ),

            // Decrement booksCount for publications
            PublicationsModel.updateMany(
                { _id: { $in: Array.from(publicationIds) } },
                {
                    $inc: { booksCount: -1 },
                },
                { new: true, runValidators: true }
            ),
        ]);

        // Delete the books
        await BooksModel.deleteMany({ _id: { $in: bookIds } });

        // Log the deletion action for each book
        await Promise.all(
            books.map((book) =>
                AdminActivityLoggerModel.create({
                    user: requester,
                    action: adminActivityLoggerConstants.actionTypes.DELETE,
                    description: `Book with ID ${book._id} deleted successfully.`,
                    details: JSON.stringify({
                        bookId: book._id,
                        bookName: book.name,
                    }),
                    affectedId: book._id,
                })
            )
        );

        // Send success response
        return sendResponse({}, 'Books deleted successfully.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to delete books: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * booksService - An object that holds the service functions for managing book-related operations.
 * These functions handle the creation, retrieval, updating, and deletion of books, including validation
 * of related data and handling of image uploads using Google Drive.
 *
 * @typedef {Object} BooksService
 * @property {Function} createNewBook - Creates a new book in the database with image upload and detailed data validation.
 * @property {Function} getBookList - Retrieves a list of books from the database based on query parameters.
 * @property {Function} getBookById - Retrieves a book by its ID from the database.
 * @property {Function} updateBookById - Updates an existing book record with new data and possibly a new image.
 * @property {Function} deleteBookById - Deletes a book by its ID from the database.
 * @property {Function} deleteBookList - Deletes multiple books from the database based on a list of book IDs.
 */
const booksService = {
    createNewBook,
    getBookList,
    getBookById,
    updateBookById,
    deleteBookById,
    deleteBookList,
};

export default booksService;

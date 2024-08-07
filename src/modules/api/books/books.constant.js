/**
 * @fileoverview This file defines and exports the constants used for validating and managing book-related data.
 * These constants include length constraints for various fields, maximum image size, and other relevant parameters.
 * The constants are used across the application to ensure consistency and standardization.
 */

const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,

    EDITION_MIN: 1,
    EDITION_MAX: 100,

    SUMMARY_MIN: 100,
    SUMMARY_MAX: 5000,

    FILE_ID: 100,
    SHAREABLE_LINK: 500,
    DOWNLOAD_LINK: 500,

    BEST_SELLER_MIN: 0,
    BEST_SELLER_MAX: 10,

    REVIEW_MIN: 0,
    REVIEW_MAX: 5,
};

const imageSize = 1.1 * 1024 * 1024; // 1.1 MB

/**
 * booksConstants - An object that holds constants for book-related validations and configurations.
 * These constants are used to enforce length constraints on fields, limit image sizes, and provide other relevant parameters.
 *
 * @typedef {Object} BooksConstants
 * @property {Object} lengths - An object defining the minimum and maximum lengths for various book-related fields.
 * @property {number} imageSize - The maximum allowed image size in bytes (1.1 MB).
 *
 * @example
 * const { lengths, imageSize } = booksConstants;
 * console.log(lengths.NAME_MIN); // 3
 * console.log(imageSize); // 1153433.6
 */
const booksConstants = {
    lengths,
    imageSize,
};

export default booksConstants;

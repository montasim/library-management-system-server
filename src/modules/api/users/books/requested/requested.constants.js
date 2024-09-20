/**
 * @fileoverview This file defines various constants used for validating request data related to books.
 * The constants include length constraints for various book-related fields and the maximum allowed image size.
 * These constants ensure that the data conforms to specified requirements for book attributes and image size.
 */

const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,

    WRITER_MIN: 1,
    WRITER_MAX: 100,

    SUBJECT_MIN: 1,
    SUBJECT_MAX: 100,

    PUBLICATION_MIN: 1,
    PUBLICATION_MAX: 100,

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

/**
 * @constant
 * @type {number}
 * @description Defines the maximum allowed image size in bytes (1.1 MB).
 */
const imageSize = 1.1 * 1024 * 1024; // 1.1 MB

/**
 * @constant
 * @type {Object}
 * @description Object containing all the defined length constraints and the maximum image size for book-related requests.
 */
const requestBooksConstants = {
    lengths,
    imageSize,
};

export default requestBooksConstants;

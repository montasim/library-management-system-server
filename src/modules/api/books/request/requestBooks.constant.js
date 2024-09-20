/**
 * @fileoverview This file defines and exports constants related to the validation and configuration of requested books.
 * These constants include length constraints for various fields, as well as a constant for the maximum image size.
 * They are used to ensure that the input data for requested books meets the specified criteria before processing.
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

const imageSize = 1.1 * 1024 * 1024; // 1.1 MB

/**
 * requestBooksConstants - An object that holds various constants for validating and configuring requested books.
 * These constants are used to enforce length constraints on fields and set the maximum image size.
 *
 * @typedef {Object} RequestBooksConstants
 * @property {Object} lengths - An object containing minimum and maximum length constraints for various fields.
 * @property {number} imageSize - A constant defining the maximum image size in bytes.
 */
const requestBooksConstants = {
    lengths,
    imageSize,
};

export default requestBooksConstants;

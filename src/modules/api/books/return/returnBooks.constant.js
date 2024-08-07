/**
 * @fileoverview This file defines and exports constants related to lending books.
 * These constants include length restrictions for remarks, which are used for validating
 * input data in lending books-related operations.
 */

const lengths = {
    /**
     * @constant {number} REMARKS_MIN - Minimum length for remarks.
     */
    REMARKS_MIN: 10,

    /**
     * @constant {number} REMARKS_MAX - Maximum length for remarks.
     */
    REMARKS_MAX: 5000,
};

/**
 * lendBooksConstants - An object that holds constants related to lending books.
 * These constants include length restrictions for remarks.
 *
 * @typedef {Object} LendBooksConstants
 * @property {Object} lengths - Length restrictions for remarks.
 * @property {number} lengths.REMARKS_MIN - Minimum length for remarks.
 * @property {number} lengths.REMARKS_MAX - Maximum length for remarks.
 */
const lendBooksConstants = {
    lengths,
};

export default lendBooksConstants;

/**
 * @fileoverview This file defines and exports constants used for validating remarks in the lend books module.
 * These constants include the minimum and maximum lengths for remarks.
 * The constants are organized into a lendBooksConstants object for easy access and maintainability.
 */

const lengths = {
    REMARKS_MIN: 10,
    REMARKS_MAX: 5000,
};

/**
 * lendBooksConstants - An object that holds constants related to the lend books module.
 * Includes length constraints for remarks to ensure they meet the specified criteria.
 *
 * @typedef {Object} LendBooksConstants
 * @property {Object} lengths - An object holding length constants for remarks.
 * @property {number} lengths.REMARKS_MIN - The minimum length for remarks.
 * @property {number} lengths.REMARKS_MAX - The maximum length for remarks.
 */
const lendBooksConstants = {
    lengths,
};

export default lendBooksConstants;

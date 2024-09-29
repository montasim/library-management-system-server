/**
 * @fileoverview This file defines constants for validating publication-related data. It includes
 * constraints on the length of publication names to ensure they adhere to the required length
 * restrictions. These constants are used in various validation schemas throughout the application.
 */

/**
 * lengths - An object containing constants for the minimum and maximum lengths of publication names.
 *
 * - NAME_MIN: Minimum length for a publication name (3 characters).
 * - NAME_MAX: Maximum length for a publication name (100 characters).
 */
const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,
    REVIEW_MAX: 5,
};

/**
 * publicationsConstants - An object containing constants for publication validation:
 *
 * - lengths: An object containing constants for the minimum and maximum lengths of publication names.
 */
const publicationsConstants = {
    lengths,
};

export default publicationsConstants;

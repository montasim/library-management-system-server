/**
 * @fileoverview This file defines various constants used for validating and managing translator-related data.
 * The constants include length constraints for different fields and image size limits.
 * These constants ensure that the translator data conforms to the required formats and constraints for various operations in the application.
 */

/**
 * Length constraints for various translator-related fields.
 *
 * @constant
 * @type {Object}
 * @property {number} NAME_MIN - Minimum length for the name.
 * @property {number} NAME_MAX - Maximum length for the name.
 * @property {number} REVIEW_MIN - Minimum value for a review rating.
 * @property {number} REVIEW_MAX - Maximum value for a review rating.
 * @property {number} SUMMARY_MIN - Minimum length for the summary.
 * @property {number} SUMMARY_MAX - Maximum length for the summary.
 */
const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,

    REVIEW_MIN: 0,
    REVIEW_MAX: 5,

    SUMMARY_MIN: 100,
    SUMMARY_MAX: 5000,
};

/**
 * Maximum image size allowed in bytes (1.1 MB).
 *
 * @constant
 * @type {number}
 */
const imageSize = 1.1 * 1024 * 1024; // 1.1 MB

/**
 * Object containing all the defined constants for translator validation.
 *
 * @constant
 * @type {Object}
 * @property {Object} lengths - Length constraints for translator-related fields.
 * @property {number} imageSize - Maximum image size allowed in bytes.
 */
const translatorsConstants = {
    lengths,
    imageSize,
};

export default translatorsConstants;

/**
 * @fileoverview This file defines constants for validating subjects-related data. It includes
 * constraints on the length of subject names to ensure they adhere to the required length restrictions.
 * These constants are used in various validation schemas throughout the application.
 */

/**
 * lengths - An object containing constants for the minimum and maximum lengths of subject names.
 *
 * - NAME_MIN: Minimum length for a subject name (3 characters).
 * - NAME_MAX: Maximum length for a subject name (100 characters).
 */
const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,
};

/**
 * subjectsConstants - An object containing constants for subject validation:
 *
 * - lengths: An object containing constants for the minimum and maximum lengths of subject names.
 */
const subjectsConstants = {
    lengths,
};

export default subjectsConstants;

/**
 * @fileoverview This file defines constants for validating roles-related data. It includes
 * constraints on the length of role names and patterns to ensure they adhere to the required
 * length restrictions and format. These constants are used in various validation schemas
 * throughout the application.
 */

/**
 * lengths - An object containing constants for the minimum and maximum lengths of role names.
 *
 * - NAME_MIN: Minimum length for a role name (3 characters).
 * - NAME_MAX: Maximum length for a role name (100 characters).
 */
const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,
};

/**
 * pattern - An object containing regular expression patterns for validating role names.
 *
 * - name: Regular expression pattern for role names.
 */
const pattern = {
    /**
     * name - Regular expression pattern for validating role names. The pattern ensures that
     * the role name starts with an uppercase letter followed by lowercase letters. Optionally,
     * it allows a second word starting with an uppercase or lowercase letter after a space.
     *
     * @example
     * const namePattern = /^[A-Z][a-z]+(?: [A-Za-z]+)?$/;
     * console.log(namePattern.test("Todo")); // true
     * console.log(namePattern.test("Test")); // true
     * console.log(namePattern.test("Data")); // true
     * console.log(namePattern.test("Todo Name")); // true
     * console.log(namePattern.test("Test role")); // true
     * console.log(namePattern.test("admin Role")); // false (first word must start with uppercase)
     */
    name: /^[A-Z][a-z]+(?: [A-Za-z]+)?$/,
};

/**
 * rolesConstants - An object containing constants for role validation:
 *
 * - lengths: An object containing constants for the minimum and maximum lengths of role names.
 * - pattern: An object containing regular expression patterns for validating role names.
 */
const rolesConstants = {
    lengths,
    pattern,
};

export default rolesConstants;

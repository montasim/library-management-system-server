const lengths = {
    NAME: {
        FIRST_MIN: 2,
        FIRST_MAX: 16,

        MIDDLE_MIN: 2,
        MIDDLE_MAX: 16,

        LAST_MIN: 2,
        LAST_MAX: 16,

        NICK_MIN: 3,
        NICK_MAX: 10,
    },

    COMPANY: {
        NAME_MAX: 50,
    },

    BIO_MAX: 500,

    ADDRESS_MIN: 2,
    ADDRESS_MAX: 200,

    DEPARTMENT_MIN: 2,
    DEPARTMENT_MAX: 100,

    DESIGNATION_MIN: 2,
    DESIGNATION_MAX: 100,
};

const pattern = {
    /**
     * Regular expression for validating names.
     *
     * This pattern is designed to match names that start with an uppercase letter followed by one or more lowercase letters.
     * It supports names composed of multiple words, where each word must also start with an uppercase letter followed by lowercase letters.
     * The pattern ensures that each part of the name (i.e., each word) starts with an uppercase character and is separated by a space.
     *
     * Examples of valid names:
     * - John
     * - Jane Doe
     * - John Jacob Jingleheimer Schmidt
     *
     * @example
     * const namePattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
     * console.log(namePattern.test("John")); // true
     * console.log(namePattern.test("john")); // false
     * console.log(namePattern.test("John Doe")); // true
     * console.log(namePattern.test("John D")); // false (second word must be more than one letter)
     */
    NAME: /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/,

    /**
     * Regular expression for validating usernames.
     *
     * This pattern ensures usernames are composed of lowercase letters, numbers, and underscores.
     * It requires usernames to start with a lowercase letter, followed by any combination of lowercase letters, numbers, and underscores.
     * No capital letters, spaces, or special characters other than underscores are allowed.
     *
     * Examples of valid usernames:
     * - john_doe
     * - jane123
     * - user_2023
     *
     * Examples of invalid usernames:
     * - John (contains a capital letter)
     * - jane doe (contains a space)
     * - 123jane (does not start with a lowercase letter)
     * - user@name (contains special characters other than underscore)
     *
     * @example
     * const usernamePattern = /^[a-z][a-z0-9_]*$/;
     * console.log(usernamePattern.test("john_doe")); // true
     * console.log(usernamePattern.test("Jane")); // false
     * console.log(usernamePattern.test("user2023")); // true
     * console.log(usernamePattern.test("john doe")); // false
     * console.log(usernamePattern.test("user@name")); // false
     */
    USERNAME: /^[a-z][a-z0-9_]*$/,

    /**
     * Regular expression for validating dates of birth in the format DD-MM-YYYY.
     *
     * This pattern ensures that the date string conforms to a specific format:
     * - DD: Two digits for the day, ranging from 01 to 31.
     * - MM: Two digits for the month, ranging from 01 to 12.
     * - YYYY: Four digits for the year, within the 20th or 21st century (1900-2099).
     *
     * The pattern accounts for most common date validations but does not check for the correctness of the day with respect to the month
     * (e.g., it does not catch 31-02 as an invalid date) or leap years. It is recommended to use additional date validation logic
     * if exact date correctness is crucial, such as in age verification processes.
     *
     * Examples of valid dates of birth:
     * - 01-01-1990
     * - 31-12-2000
     * - 29-02-2004 (leap year)
     *
     * Examples of invalid dates of birth:
     * - 31-02-2001 (February 31st does not exist)
     * - 00-12-1990 (day cannot be zero)
     * - 01-13-2020 (there is no 13th month)
     *
     * @example
     * const dateOfBirthPattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;
     * console.log(dateOfBirthPattern.test("31-12-1998")); // true
     * console.log(dateOfBirthPattern.test("29-02-2001")); // false (non-leap year)
     * console.log(dateOfBirthPattern.test("01-13-2020")); // false (invalid month)
     */
    DATE_OF_BIRTH: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/,
};

const imageSize = 1.1 * 1024 * 1024; // 1.1 MB

const userConstants = {
    lengths,
    pattern,
    imageSize,
};

export default userConstants;

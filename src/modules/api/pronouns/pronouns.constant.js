const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,
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
     * - Male
     * - Rather not say
     * - Not Specified
     *
     * @example
     * const namePattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
     * console.log(namePattern.test("Male")); // true
     * console.log(namePattern.test("Female")); // false
     * console.log(namePattern.test("Rather not say")); // true
     * console.log(namePattern.test("Gay D")); // false (second word must be more than one letter)
     */
    NAME: /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/,
};

const pronounsConstants = {
    lengths,
    pattern,
};

export default pronounsConstants;

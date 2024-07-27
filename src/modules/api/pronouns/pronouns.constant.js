const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,
};

const pattern = {
    /**
     * Regular expression for validating names with flexible capitalization rules.
     *
     * This pattern matches names where the first word starts with an uppercase letter followed by one or more lowercase letters,
     * and any subsequent words can start with any lowercase letter. This is suitable for less formal names or phrases used in user input.
     * The pattern ensures that the first word adheres to capitalization norms, while subsequent words are more flexibly handled.
     *
     * Examples of valid names:
     * - Male (single word, starting uppercase)
     * - Rather not say (subsequent words start lowercase)
     * - Not specified (subsequent words start lowercase)
     *
     * @example
     * const namePattern = /^[A-Z][a-z]+(?: [a-z]+)*$/;
     * console.log(namePattern.test("Male")); // true
     * console.log(namePattern.test("female")); // false (first word must start with uppercase)
     * console.log(namePattern.test("Rather not say")); // true
     * console.log(namePattern.test("Gay D")); // true (second word can be lowercase)
     */
    NAME: /^[A-Z][a-z]+(?: [a-z]+)*$/,
};

const pronounsConstants = {
    lengths,
    pattern,
};

export default pronounsConstants;

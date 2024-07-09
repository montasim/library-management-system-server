/**
 * Converts a single word to sentence case.
 * @param {string} word - The word to convert.
 * @returns {string} The word converted to sentence case.
 */
const toSentenceCase = (word) => {
    if (!word) return ''; // Return an empty string if no word is provided

    return word[0].toUpperCase() + word.slice(1).toLowerCase();
};

export default toSentenceCase;

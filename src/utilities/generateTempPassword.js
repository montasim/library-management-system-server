import patterns from '../constant/patterns.constants.js';

const generateTempPassword = (min, max) => {
    // Ensure min and max are within acceptable range
    if (min < 8) min = 8;
    if (max > 20) max = 20;
    if (min > max) [min, max] = [max, min]; // Swap if min is greater than max

    const length = Math.floor(Math.random() * (max - min + 1)) + min; // Random length between min and max
    let password = '';

    // Helper function to get a random character from a pattern
    const getRandomCharFromPattern = (pattern) => {
        const matchingChars =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:"<>?`~[];,./|\\-='.match(
                pattern
            );
        return matchingChars[Math.floor(Math.random() * matchingChars.length)];
    };

    // Ensure password meets all requirements
    password += getRandomCharFromPattern(patterns.UPPERCASE);
    password += getRandomCharFromPattern(patterns.LOWERCASE);
    password += getRandomCharFromPattern(patterns.DIGITS);
    password += getRandomCharFromPattern(patterns.SPECIAL_CHARACTERS);

    // Fill the rest of the password with random characters from all possible patterns
    while (password.length < length) {
        const allPatterns = [
            patterns.UPPERCASE,
            patterns.LOWERCASE,
            patterns.DIGITS,
            patterns.SPECIAL_CHARACTERS,
        ];
        const randomPattern =
            allPatterns[Math.floor(Math.random() * allPatterns.length)];
        password += getRandomCharFromPattern(randomPattern);
    }

    // Shuffle the password to avoid predictable sequences
    password = password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');

    return password;
};

export default generateTempPassword;

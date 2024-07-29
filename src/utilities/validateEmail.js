import patterns from '../constant/patterns.constants.js';
import loadListFromFile from './loadListFromFile.js';

const validateEmail = async (email) => {
    if (!patterns.EMAIL.test(email)) {
        return 'Email must be a valid email';
    }

    const domain = email.split('@')[1].toLowerCase();

    const blockedEmailDomains = await loadListFromFile('../vendor/blockedEmailDomains.txt');
    if (blockedEmailDomains.has(domain)) {
        return 'Email services is not allowed';
    }

    const tempEmailDomains = await loadListFromFile('../vendor/tempEmailDomains.txt');
    if (tempEmailDomains.has(domain)) {
        return 'Use of temporary email services is not allowed';
    }

    if (email.split('@')[0].match(/\+\d+$/)) {
        return 'Emails with a "+number" pattern are not allowed';
    }

    return 'Valid'; // Return 'Valid' if all checks are passed
};

export default validateEmail;

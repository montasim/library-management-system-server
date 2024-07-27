/**
 * @fileoverview Blocked Email Domain Loader Module for Node.js Applications.
 *
 * This module provides a critical utility for application security by managing and verifying email addresses during user interactions such as registration and profile updates. The utility function loads a list of blocked email domains from a text file, ensuring that emails from these domains are not accepted. This is crucial for maintaining the integrity of user data and enforcing security policies related to email communication and user accountability.
 *
 * It reads and processes the list of known blocked email domains, normalizing each entry to lowercase and trimming extraneous whitespace for consistent validation. These domains are then stored in a Set for quick lookup, allowing for efficient and rapid checks against user-provided email addresses during critical operations like user registration.
 *
 * The module utilizes modern JavaScript features along with Node.js's filesystem (`fs/promises`) and path modules to offer a straightforward and robust solution for integrating blocked domain checks into applications. It handles I/O errors gracefully by resolving to an empty Set, thus ensuring the application's functionality remains uninterrupted even in error scenarios.
 */

import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import logger from '../utilities/logger.js';

// Derive the __dirname equivalent for ES6 modules using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Asynchronously loads a list of blocked email domains from a text file, returning them as a Set.
 * This utility enhances security practices by filtering out emails from undesirable or risky domains during critical user operations such as account creation and profile updates.
 *
 * The function operates by reading a designated file where each domain is listed on a separate line. It trims whitespace from each line, converts the domain to lowercase for uniformity, and compiles these into a Set, ensuring fast and efficient validation checks.
 *
 * @returns {Promise<Set<string>>} A promise that resolves to a Set containing blocked email domains, facilitating quick lookups to determine if an email address is from a blocked domain. If an error occurs during file reading (e.g., file not found, permissions issue), the promise resolves to an empty Set to maintain operational stability.
 * @example
 * // Usage example of loadBlockedEmailDomains
 * loadBlockedEmailDomains()
 *   .then(blockedEmailDomains => {
 *     const userEmailDomain = userEmail.split('@')[1].toLowerCase();
 *     if (blockedEmailDomains.has(userEmailDomain)) {
 *       console.log('Blocked email domain detected. Please use another email address.');
 *     } else {
 *       console.log('Email address is acceptable.');
 *     }
 *   })
 *   .catch(error => {
 *     console.error('Failed to load blocked email domains:', error);
 *   });
 */
const loadBlockedEmailDomains = async () => {
    const filePath = join(__dirname, '../vendor/blockedEmailDomains.txt'); // Ensure the path reflects your actual file structure

    try {
        const data = await fs.readFile(filePath, { encoding: 'utf-8' });
        const lines = data.split('\n').map((line) => line.trim().toLowerCase());

        return new Set(lines);
    } catch (error) {
        logger.error('Error loading the blocked email domain list:', error);

        return new Set(); // Return an empty set on error to allow continued operation
    }
};

export default loadBlockedEmailDomains;

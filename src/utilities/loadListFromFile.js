import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import loggerService from '../service/logger.service.js';

// Derive the __dirname equivalent for ES6 modules using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Asynchronously loads a list from a text file and returns it as a Set.
 * This function is designed to handle the loading of various types of lists such as blocked email domains,
 * common passwords, or temporary email domains from specified files.
 *
 * @param {string} filePathRelative - The relative path to the text file.
 * @returns {Promise<Set<string>>} A promise that resolves to a Set containing the items from the file.
 */
const loadListFromFile = async (filePathRelative) => {
    const filePath = join(__dirname, filePathRelative);

    try {
        const data = await fs.readFile(filePath, { encoding: 'utf-8' });
        const lines = data.split('\n').map(line => line.trim().toLowerCase());

        return new Set(lines);
    } catch (error) {
        loggerService.error(`Error loading list from file ${filePath}:`, error);

        return new Set(); // Return an empty set on error to allow continued operation
    }
};

export default loadListFromFile;

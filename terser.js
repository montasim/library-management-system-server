/**
 * This script processes JavaScript files by minifying them using Terser and copies other types of files.
 * It reads configurations from a build.json, respects ignore patterns, and logs the process summary.
 *
 * @fileoverview Script to minify JavaScript files and copy other file types while tracking file sizes.
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { minify } from 'terser';

const ROOT_DIR = '.';
const OUTPUT_DIR = path.join(ROOT_DIR, 'build');
const CONFIG_FILE = path.join(ROOT_DIR, 'terserrc.json');
const DEFAULT_IGNORE_PATTERNS = ['node_modules/**', `${OUTPUT_DIR}/**`];

/**
 * Loads the configuration from a JSON file.
 * @param {string} filePath - Path to the configuration file.
 * @returns {Object|null} The configuration object or null if an error occurs.
 */
const loadConfig = (filePath) => {
    try {
        const configData = fs.readFileSync(filePath, 'utf8');

        return JSON.parse(configData);
    } catch (error) {
        console.error('Error reading configuration:', error);

        return null;
    }
};

/**
 * Ensures that a directory exists, and if it doesn't, creates it.
 * @param {string} directory - Path to the directory to check and create if necessary.
 */
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

/**
 * Gets the file size in bytes.
 * @param {string} filePath - Path to the file.
 * @returns {number} Size of the file in bytes.
 */
const getFileSize = (filePath) => {
    try {
        const { size } = fs.statSync(filePath);

        return size;
    } catch {
        return 0;
    }
};

/**
 * Converts bytes to kilobytes.
 * @param {number} bytes - The number of bytes.
 * @returns {string} The size in kilobytes, rounded to two decimal places.
 */
const bytesToKilobytes = (bytes) => {
    return (bytes / 1024).toFixed(2);
};

/**
 * Minifies JavaScript files using Terser.
 * @param {string} file - The filename.
 * @param {string} srcPath - Source path of the file.
 * @param {string} destPath - Destination path after processing.
 * @param {Object} options - Terser configuration options.
 * @param {Object} sizeTracker - Tracker for original and minified sizes.
 * @returns {Promise<string>} The result of the minification process.
 */
const minifyJavaScript = async (file, srcPath, destPath, options, sizeTracker) => {
    const fileContent = fs.readFileSync(srcPath, 'utf8');
    const originalSize = getFileSize(srcPath);
    const terserResult = await minify(fileContent, options);

    if (terserResult.error) {
        throw terserResult.error;
    }

    fs.writeFileSync(destPath, terserResult.code, 'utf8');

    const newSize = getFileSize(destPath);

    sizeTracker.originalTotal += originalSize;
    sizeTracker.minifiedTotal += newSize;

    return 'minified';
};

/**
 * Copies files from the source path to the destination path.
 * @param {string} srcPath - Source path of the file.
 * @param {string} destPath - Destination path after copying.
 * @returns {string} The result of the copy process.
 */
const copyFile = (srcPath, destPath) => {
    fs.copyFileSync(srcPath, destPath);

    return 'copied';
};

/**
 * Processes all files based on configurations, handling both minification and copying.
 * @param {Array<string>} files - List of files to process.
 * @param {string} rootDir - Root directory for source files.
 * @param {string} outputDir - Output directory for processed files.
 * @param {Object} config - Configuration for processing.
 * @returns {Promise<Object>} The stats and size tracking of the process.
 */
const processFiles = async (files, rootDir, outputDir, config) => {
    const stats = { minified: 0, copied: 0, failed: 0 };
    const sizeTracker = { originalTotal: 0, minifiedTotal: 0 };

    for (const file of files) {
        const srcPath = path.join(rootDir, file);
        const destPath = path.join(outputDir, file);

        ensureDirectoryExists(path.dirname(destPath));

        try {
            if (file.endsWith('.js')) {
                const result = await minifyJavaScript(file, srcPath, destPath, config, sizeTracker);

                if (result === 'minified') {
                    stats.minified++;
                }
            } else {
                const result = copyFile(srcPath, destPath);

                if (result === 'copied') {
                    stats.copied++;
                }
            }
        } catch (error) {
            console.error(`Error processing ${file}: ${error}`);

            stats.failed++;
        }
    }

    return { stats, sizeTracker };
};

/**
 * The main function to execute the file processing.
 */
const main = async () => {
    ensureDirectoryExists(OUTPUT_DIR);

    const config = loadConfig(CONFIG_FILE);

    if (!config) {
        return;
    }

    const ignorePatterns = config.ignore ? config.ignore.concat(DEFAULT_IGNORE_PATTERNS) : DEFAULT_IGNORE_PATTERNS;
    const allFiles = globSync('**/*', { ignore: ignorePatterns, nodir: true });
    const { stats, sizeTracker } = await processFiles(allFiles, ROOT_DIR, OUTPUT_DIR, config);

    // Using console.table for a neat summary output, converting bytes to KB
    console.table({
        'Total': allFiles.length,
        'Minified': stats.minified,
        'Copied': stats.copied,
        'Failed': stats.failed,
        'Original Size (KB)': parseFloat(bytesToKilobytes(sizeTracker.originalTotal)),
        'Minified Size (KB)': parseFloat(bytesToKilobytes(sizeTracker.minifiedTotal)),
    });
};

main().catch(error => {
    console.error("Failed to process files:", error);
});

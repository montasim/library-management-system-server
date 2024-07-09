/**
 * Validates a file based on type, size, and optional extensions.
 *
 * @param {Object} file - The file object to validate.
 * @param {number} maxSize - Maximum file size in bytes.
 * @param {Array<string>} allowedTypes - Array of allowed MIME types.
 * @param {Array<string>} [allowedExtensions] - Optional array of allowed file extensions.
 * @returns {Object} Validation result with a boolean status and a message.
 */
const validateFile = (file, maxSize, allowedTypes, allowedExtensions = []) => {
    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
        return {
            isValid: false,
            message: `Invalid file type. Allowed types are: ${allowedTypes.join(', ')}.`,
        };
    }

    // Check file size
    if (file.size > maxSize) {
        return {
            isValid: false,
            message: `File size should not exceed ${maxSize / 1024 / 1024}MB.`,
        };
    }

    // Check file extension if extensions are specified
    if (allowedExtensions.length > 0) {
        const extension = file.originalname.split('.').pop();
        if (!allowedExtensions.includes(extension.toLowerCase())) {
            return {
                isValid: false,
                message: `Invalid file extension. Allowed extensions are: ${allowedExtensions.join(', ')}.`,
            };
        }
    }

    return {
        isValid: true,
        message: 'File is valid.',
    };
};

export default validateFile;

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a JSDOM window object to use with DOMPurify
const { window } = new JSDOM('');
const dompurify = DOMPurify(window);

// Sanitization function to cleanse all strings in an object
const sanitize = obj => {
    const seen = new WeakSet();  // Avoid circular reference issues

    // Recursively sanitize objects and arrays
    const recurSanitize = (object) => {
        if (seen.has(object)) {
            return;
        }
        seen.add(object);

        Object.keys(object).forEach(key => {
            const value = object[key];
            if (typeof value === 'string') {
                object[key] = dompurify.sanitize(value);
            } else if (value && typeof value === 'object') {  // Check for non-null objects
                recurSanitize(value);
            }
        });
    };

    recurSanitize(obj);
};

// Middleware to sanitize query, body, and params of a request
const sanitizeRequestConfiguration = (req, res, next) => {
    try {
        ['body', 'query', 'params'].forEach(part => {
            if (req[part] && typeof req[part] === 'object') {
                sanitize(req[part]);
            }
        });
    } catch (error) {
        console.error('Sanitization error:', error);

        return res.status(500).json({
            success: false,
            message: 'Error processing request, please try again later.'
        });
    }

    next();
};

export default sanitizeRequestConfiguration;

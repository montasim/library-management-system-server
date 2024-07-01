import morgan from 'morgan';
import logger from '../utilities/logger.js';

// Custom token to log request bodies
morgan.token('body', (req) => JSON.stringify(req.body));

const morganConfiguration = morgan(
    (tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res), 'ms',
            // 'body:', tokens.body(req, res), // Log request body
            'from', tokens.referrer(req, res),
            'user-agent:', tokens['user-agent'](req, res),
        ].join(' ');
    },
    { stream: { write: (message) => logger.info(message) } }
);

export default morganConfiguration;

import morgan from 'morgan';

import loggerService from '../service/logger.service.js';

// Custom token to log requestBooks bodies
morgan.token('body', (req) => JSON.stringify(req.body));

const morganConfiguration = morgan(
    (tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
            // 'body:', tokens.body(req, res), // Log requestBooks body
            'from',
            tokens.referrer(req, res),
            'user-agent:',
            tokens['user-agent'](req, res),
        ].join(' ');
    },
    { stream: { write: (message) => loggerService.info(message) } }
);

export default morganConfiguration;

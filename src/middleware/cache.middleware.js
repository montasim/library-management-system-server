import NodeCache from 'node-cache';

import loggerService from '../service/logger.service.js';

const cache = new NodeCache();

const create = (duration = 3600) => {
    return (req, res, next) => {
        let key;

        // If the requestBooks is a GET requestBooks, extract the resource name from the URL
        if (req.method === 'GET') {
            // Extract the last segment of the URL as the cache key
            const urlSegments = req.originalUrl.split('/');

            key = urlSegments[urlSegments.length - 1].split('?')[0];

            loggerService.debug(`Cache key generated for GET request: ${key}`);
        } else {
            // Create a unique cache key for non-GET requests based on route and method
            const routeName = req.route.path
                .replace(/\//g, '_')
                .replace(/:/g, '');
            key = `${routeName}_${req.method}_${req.originalUrl || req.url}`;

            loggerService.debug(
                `Cache key generated for non-GET request: ${key}`
            );
        }

        // Cache retrieval for GET requests
        if (req.method === 'GET') {
            const cachedBody = cache.get(key);
            if (cachedBody) {
                loggerService.info(
                    `Cache hit: Serving from cache for key ${key}`
                );

                return res.status(cachedBody.status).send(cachedBody.body);
            } else {
                loggerService.warn(`Cache miss: No entry found for key ${key}`);

                // Overriding response methods to cache new data
                const originalSend = res.send.bind(res);
                const originalStatus = res.status.bind(res);
                let responseStatus = 200;

                // Override the send method to cache the response
                res.status = (code) => {
                    responseStatus = code;

                    return originalStatus(code);
                };

                // Override the send method to cache the response
                res.send = (body) => {
                    if (responseStatus >= 200 && responseStatus < 300) {
                        cache.set(
                            key,
                            { body, status: responseStatus },
                            duration
                        );

                        loggerService.info(
                            `Data cached for key ${key} with status ${responseStatus}`
                        );
                    }

                    originalSend(body);
                };

                next();
            }
        } else {
            next();
        }
    };
};

const invalidate = (routeName) => {
    return (req, res, next) => {
        // Directly use the routeName as the key to invalidate
        const keys = cache.keys();

        // Loop through all the keys in the cache and delete the ones that match the routeName
        keys.forEach((key) => {
            if (key.startsWith(routeName)) {
                cache.del(key);

                loggerService.info(`Cache invalidated for key ${key}`);
            }
        });

        next();
    };
};

const cacheMiddleware = {
    create,
    invalidate,
};

export default cacheMiddleware;

/**
 * Creates a Winston logger instance to handle application logging.
 *
 * The logger is configured to handle various logging levels and outputs:
 * 1. Console: Logs all levels starting from 'debug' with colorized output for better readability.
 * 2. MongoDB: Stores logs from 'info' level upwards in a MongoDB database.
 *
 * The MongoDB transport ensures that log entries are stored in a structured format in a
 * 'log' collection within the specified database, making use of a capped collection
 * to limit the storage size and maintain performance.
 *
 * Configuration options such as the database connection string are fetched from an external
 * configuration file, allowing for easy adjustments without code changes.
 *
 * @module LoggerService
 * @see {@link https://github.com/winstonjs/winston} for the Winston logger documentation.
 * @see {@link https://github.com/winstonjs/winston-mongodb} for the MongoDB transport plugin documentation.
 *
 * @example
 * // Use the logger to log an informational message
 * loggerService.info('This is an info message');
 *
 * @example
 * // Use the logger to log an error message
 * loggerService.error('This is an error message');
 */

import winston from 'winston';
import { MongoDB } from 'winston-mongodb';

import configuration from '../configuration/configuration.js';

const loggerService = winston.createLogger({
    level: 'debug', // This will capture all logs at level 'debug' and above
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug', // Consider setting this to 'info' in production if 'debug' is too verbose
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    (info) => `${info.timestamp} ${info.level}: ${info.message}`
                )
            ),
        }),
        new MongoDB({
            level: 'info',
            db: configuration.mongoose.url,
            options: { useUnifiedTopology: true },
            collection: 'log',
            storeHost: true,
            capped: true,
            cappedMax: 10000,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
});

export default loggerService;

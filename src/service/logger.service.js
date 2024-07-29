import mongoose from 'mongoose';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { MongoDB } from 'winston-mongodb';

import configuration from '../configuration/configuration.js';
import environment from '../constant/envTypes.constants.js';

// Check if the environment is production
const isProduction = configuration.env === environment.PRODUCTION;

const loggerService = winston.createLogger({
    level: 'debug', // This will capture all logs at level 'debug' and above
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [
        // Console transport for output on the console
        new winston.transports.Console({
            level: 'debug', // Consider setting this to 'info' in production if 'debug' is too verbose
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    (info) => `${info.timestamp} ${info.level}: ${info.message}`
                )
            ),
        }),
        // MongoDB transport for saving logs to the database
        new MongoDB({
            level: 'info',
            db: mongoose.connection,  // Use the existing mongoose connection
            collection: 'log',
            storeHost: true,
            capped: true,
            cappedMax: 10000,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
        // Conditionally add file transports based on the environment
        ...(!isProduction ? [
            new DailyRotateFile({
                level: 'debug',
                filename: 'logs/debug-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
            new DailyRotateFile({
                level: 'info',
                filename: 'logs/info-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
            new DailyRotateFile({
                level: 'warn',
                filename: 'logs/warn-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
            new DailyRotateFile({
                level: 'error',
                filename: 'logs/error-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
            new DailyRotateFile({
                level: 'fatal',
                filename: 'logs/fatal-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
        ] : []),
    ],
});

export default loggerService;

import mongoose from 'mongoose';

import configuration from '../configuration/configuration.js';
import loggerService from './logger.service.js';

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * It listens to various connection events (error, reconnected, and disconnected) to log and handle
 * them appropriately. In case of disconnection, it attempts to reconnect.
 *
 * This function is asynchronous and returns a promise that resolves upon successful connection
 * or rejects if the connection cannot be established.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} A promise that resolves when the database connection is successful.
 */
const connect = async () => {
    // Set up event listeners for the MongoDB connection
    mongoose.connection.on('error', (error) =>
        loggerService.error(`Database connection error: ${error.message}`)
    );

    // mongoose.connection.on('connected', () =>
    //     loggerService.info('Database connection established.')
    // );

    // mongoose.connection.on('connecting', () =>
    //     loggerService.info('Attempting to connect to the database...')
    // );

    mongoose.connection.on('disconnecting', () =>
        loggerService.info('Database is disconnecting...')
    );

    mongoose.connection.on('disconnected', async () => {
        loggerService.warn('Database disconnected! Attempting to reconnect...');

        try {
            await mongoose.connect(configuration.mongoose.url);
            loggerService.info('Database reconnected successfully.');
        } catch (error) {
            loggerService.error(
                `Database reconnection failed: ${error.message}`
            );
        }
    });

    mongoose.connection.on('uninitialized', () =>
        loggerService.warn('Database connection is uninitialized.')
    );

    mongoose.connection.on('reconnected', () =>
        loggerService.info('Database has successfully reconnected.')
    );

    // Attempt to connect to the database
    try {
        await mongoose.connect(configuration.mongoose.url);
        const dbName = mongoose.connection.db.databaseName;

        loggerService.info(`Database connected successfully to '${dbName}'.`);
    } catch (error) {
        loggerService.error(
            `Initial database connection attempt failed: ${error.message}`
        );

        throw error; // Re-throwing is necessary for the caller to handle it
    }
};

/**
 * Disconnects from the MongoDB database using Mongoose.
 * It logs the process of disconnection and handles any errors that may occur during the disconnection process.
 * This function is crucial for gracefully shutting down the application and releasing database resources.
 *
 * @async
 * @function disconnect
 * @returns {Promise<void>} A promise that resolves when the database has been successfully disconnected.
 */
const disconnect = async () => {
    try {
        loggerService.info('Database connection disconnecting...');

        await mongoose.disconnect();

        loggerService.info('Database connection disconnected successfully.');
    } catch (error) {
        loggerService.error(`Database disconnection error: ${error.message}`);

        throw error; // Re-throwing is necessary for the caller to handle it
    }
};

const DatabaseService = {
    connect,
    disconnect,
};

export default DatabaseService;

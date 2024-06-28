import mongoose from 'mongoose';
import configuration from '../configuration/configuration.js';

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
    // Setting up connection event listeners before initiating the connecting
    mongoose.connection.on('error', (error) => console.error(`Database connection error: ${error}`));

    mongoose.connection.on('reconnected', () => console.info('Database reconnected'));

    mongoose.connection.on('disconnected', async () => {
        console.info('Database disconnected! Attempting to reconnect...');

        try {
            await mongoose.connect(configuration.mongoose.url);

            console.info('Database reconnected successfully');
        } catch (error) {
            console.error(`Database reconnection error: ${error}`);
        }
    });

    try {
        await mongoose.connect(configuration.mongoose.url);

        const dbName = mongoose.connection.name;

        console.info(`Database connected successfully to ${dbName}`);
    } catch (error) {
        console.error(`Database connection error: ${error}`);

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
        // Log when the disconnection process starts
        console.info('Database connection disconnecting...');

        await mongoose.disconnect();

        // Since listeners are set up per disconnect call, it logs directly after await
        console.info('Database disconnected successfully');
    } catch (error) {
        console.error(`Database disconnection error: ${error}`);

        throw error; // Re-throwing is necessary for the caller to handle it
    }
};

const DatabaseMiddleware = {
    connect,
    disconnect,
};

export default DatabaseMiddleware;

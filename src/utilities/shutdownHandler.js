import logger from './logger.js';
import DatabaseMiddleware from '../middleware/database.middleware.js';
import initiateGracefulShutdown from './initiateGracefulShutdown.js';

const shutdownHandler = async (signal, server) => {
    logger.log(`Received ${signal}.`);

    try {
        await DatabaseMiddleware.disconnect();
        await initiateGracefulShutdown(signal, server);
    } catch (shutdownError) {
        logger.error(
            `Error during graceful shutdown on ${signal}: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default shutdownHandler;

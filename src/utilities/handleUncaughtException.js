import logger from './logger.js';
import initiateGracefulShutdown from './initiateGracefulShutdown.js';

const handleUncaughtException = async (error, server) => {
    logger.error(`Uncaught Exception: ${error.message}`, error.stack);

    try {
        await initiateGracefulShutdown('Uncaught Exception', server, error);
    } catch (shutdownError) {
        logger.error(`Failed to shutdown gracefully: ${shutdownError.message}`);

        process.exit(1);
    }
};

export default handleUncaughtException;

import initiateGracefulShutdown from './initiateGracefulShutdown.js';
import logger from './logger.js';

const handleServerError = async (error, server) => {
    logger.error(
        `Server startup error on port ${server.address().port}: ${error.message}`
    );

    try {
        await initiateGracefulShutdown('Startup Failure', server, error);
    } catch (shutdownError) {
        logger.error(
            `Error during graceful shutdown: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default handleServerError;

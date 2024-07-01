import logger from './logger.js';
import initiateGracefulShutdown from './initiateGracefulShutdown.js';

const handleUnhandledRejection = async (error, server) => {
    logger.error(
        `Unhandled Rejection: ${error instanceof Error ? error.message : error}`,
        error.stack
    );

    try {
        await initiateGracefulShutdown('Unhandled Rejection', server, error);
    } catch (shutdownError) {
        logger.error(`Failed to shutdown gracefully: ${shutdownError.message}`);

        process.exit(1);
    }
};

export default handleUnhandledRejection;

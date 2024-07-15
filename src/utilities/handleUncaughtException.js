import loggerService from '../service/logger.service.js';
import initiateGracefulShutdown from './initiateGracefulShutdown.js';

const handleUncaughtException = async (error, server) => {
    loggerService.error(`Uncaught Exception: ${error.message}`, error.stack);

    try {
        await initiateGracefulShutdown('Uncaught Exception', server, error);
    } catch (shutdownError) {
        loggerService.error(
            `Failed to shutdown gracefully: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default handleUncaughtException;

import initiateGracefulShutdown from './initiateGracefulShutdown.js';
import loggerService from '../service/logger.service.js';

const handleUnhandledRejection = async (error, server) => {
    loggerService.error(
        `Unhandled Rejection: ${error instanceof Error ? error.message : error}`,
        error.stack
    );

    try {
        await initiateGracefulShutdown('Unhandled Rejection', server, error);
    } catch (shutdownError) {
        loggerService.error(
            `Failed to shutdown gracefully: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default handleUnhandledRejection;

import initiateGracefulShutdown from './initiateGracefulShutdown.js';
import loggerService from '../service/logger.service.js';

const handleServerError = async (error, server) => {
    loggerService.error(
        `Server startup error on port ${server.address().port}: ${error.message}`
    );

    try {
        await initiateGracefulShutdown('Startup Failure', server, error);
    } catch (shutdownError) {
        loggerService.error(
            `Error during graceful shutdown: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default handleServerError;

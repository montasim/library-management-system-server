import DatabaseService from '../service/database.service.js';
import initiateGracefulShutdown from './initiateGracefulShutdown.js';
import loggerService from '../service/logger.service.js';

const shutdownHandler = async (signal, server) => {
    loggerService.log(`Received ${signal}.`);

    try {
        await DatabaseService.disconnect();
        await initiateGracefulShutdown(signal, server);
    } catch (shutdownError) {
        loggerService.error(
            `Error during graceful shutdown on ${signal}: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default shutdownHandler;

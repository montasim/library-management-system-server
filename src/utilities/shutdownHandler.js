import logger from './logger.js';
import DatabaseService from '../service/database.service.js';
import initiateGracefulShutdown from './initiateGracefulShutdown.js';

const shutdownHandler = async (signal, server) => {
    logger.log(`Received ${signal}.`);

    try {
        await DatabaseService.disconnect();
        await initiateGracefulShutdown(signal, server);
    } catch (shutdownError) {
        logger.error(
            `Error during graceful shutdown on ${signal}: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default shutdownHandler;

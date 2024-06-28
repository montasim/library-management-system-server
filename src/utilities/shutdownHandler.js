import DatabaseMiddleware from '../middleware/database.middleware.js';
import initiateGracefulShutdown from './initiateGracefulShutdown.js';

const shutdownHandler = async (signal, server) => {
    console.log(`Received ${signal}.`);

    try {
        await DatabaseMiddleware.disconnect();
        await initiateGracefulShutdown(signal, server);
    } catch (shutdownError) {
        console.error(
            `Error during graceful shutdown on ${signal}: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default shutdownHandler;

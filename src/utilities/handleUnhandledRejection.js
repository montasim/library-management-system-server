import initiateGracefulShutdown from './initiateGracefulShutdown.js';

const handleUnhandledRejection = async (error, server) => {
    console.error(`Unhandled Rejection: ${error instanceof Error ? error.message : error}`, error.stack);

    try {
        await initiateGracefulShutdown('Unhandled Rejection', server);
    } catch (shutdownError) {
        console.error(`Failed to shutdown gracefully: ${shutdownError.message}`);

        process.exit(1);
    }
};

export default handleUnhandledRejection;

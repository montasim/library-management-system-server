import initiateGracefulShutdown from './initiateGracefulShutdown.js';

const handleServerError = async (error, server) => {
    console.error(
        `Server startup error on port ${server.address().port}: ${error.message}`
    );

    try {
        await initiateGracefulShutdown('Startup Failure', server);
    } catch (shutdownError) {
        console.error(
            `Error during graceful shutdown: ${shutdownError.message}`
        );

        process.exit(1);
    }
};

export default handleServerError;

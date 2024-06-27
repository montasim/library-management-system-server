import app from './src/app.js';

import initiateGracefulShutdown from './src/utilities/initiateGracefulShutdown.js';
import shutdownHandler from './src/utilities/shutdownHandler.js';

const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Server Startup Errors - Such as port in use, permissions issues, etc.
server.on('error', async (error) => {
    console.error(`Server startup error on port ${PORT}: ${error.message}`);

    try {
        await initiateGracefulShutdown('Startup Failure', server);
    } catch (shutdownError) {
        console.error(`Error during graceful shutdown: ${shutdownError.message}`);

        process.exit(1);
    }
});

// Uncaught Exceptions - These are errors that were not caught and handled within your code.
process.on('uncaughtException', async (error) => {
    console.error(`Uncaught Exception: ${error}`);

    try {
        await initiateGracefulShutdown('Uncaught Exception', server);
    } catch (shutdownError) {
        console.error(`Uncaught Exception: ${error.message}`, error.stack);

        process.exit(1);
    }
});

// Unhandled Promise Rejections - Promises that fail without a .catch() handler.
process.on('unhandledRejection', async (error) => {
    console.error(`Unhandled Rejection: ${error instanceof Error ? error.message : error}`, error.stack);

    try {
        await initiateGracefulShutdown('Unhandled Rejection', server);
    } catch (shutdownError) {
        console.error(`Failed to shutdown gracefully: ${shutdownError}`);

        process.exit(1);
    }
});

// Process Signals - SIGINT and SIGTERM, which are typical termination signals sent by operating systems or manually by users.Process Signals - SIGINT and SIGTERM, which are typical termination signals sent by operating systems or manually by users.
process.on('SIGINT', () => shutdownHandler('SIGINT', server));
process.on('SIGTERM', () => shutdownHandler('SIGTERM', server));

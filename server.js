import app from './src/app.js';

import handleServerError from './src/utilities/handleServerError.js';
import shutdownHandler from './src/utilities/shutdownHandler.js';
import handleUncaughtException from './src/utilities/handleUncaughtException.js';
import handleUnhandledRejection from './src/utilities/handleUnhandledRejection.js';

const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Server Startup Errors - Such as port in use, permissions issues, etc.
server.on('error', error => handleServerError(error, server));

// Uncaught Exceptions - These are errors that were not caught and handled within your code.
process.on('uncaughtException', error => handleUncaughtException(error, server));

// Unhandled Promise Rejections - Promises that fail without a .catch() handler.
process.on('unhandledRejection', error => handleUnhandledRejection(error, server));

// Process Signals - SIGINT and SIGTERM, which are typical termination signals sent by operating systems or manually by users.Process Signals - SIGINT and SIGTERM, which are typical termination signals sent by operating systems or manually by users.
process.on('SIGINT', () => shutdownHandler('SIGINT', server));
process.on('SIGTERM', () => shutdownHandler('SIGTERM', server));

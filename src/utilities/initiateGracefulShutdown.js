const initiateGracefulShutdown = async (reason, server) => {
    console.log(`Shutting down gracefully due to ${reason}.`);

    const shutdownTimeout = setTimeout(() => {
        console.error('Shutdown timed out, forcing shutdown.');

        process.exit(1);
    }, 30000); // 30 seconds timeout

    try {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                clearTimeout(shutdownTimeout);

                if (error) {
                    console.error(
                        `Failed to close server due to: ${error.message}`
                    );

                    reject(error);
                } else {
                    console.log('Server successfully closed.');

                    resolve();
                }
            });
        });
    } catch (error) {
        throw new Error(`Shutdown failed due to: ${error.message}`);
    }
};

export default initiateGracefulShutdown;

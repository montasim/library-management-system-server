import EmailService from '../service/email.service.js';
import configuration from '../configuration/configuration.js';
import prepareEmailContent from '../shared/prepareEmailContent.js';
import prepareEmail from '../shared/prepareEmail.js';
import loggerService from '../service/logger.service.js';

const initiateGracefulShutdown = async (reason, server, error) => {
    loggerService.log(`Shutting down gracefully due to ${reason}.`);

    const emailData = {};

    emailData.reason = reason;
    emailData.errorCode = error.code;
    emailData.component = error.syscall;
    emailData.path = error.path;
    emailData.address = error.address;
    emailData.port = error.port;
    emailData.timeDetected = new Date().toDateString();

    const subject = 'System Error - Critical Issue Detected';
    const {
        pageTitle,
        preheaderText,
        heroSection,
        mainSection,
        footerContent,
    } = prepareEmailContent(subject, emailData);

    await EmailService.sendEmail(
        configuration.admin.email,
        subject,
        prepareEmail(
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent
        )
    );

    const shutdownTimeout = setTimeout(() => {
        loggerService.error('Shutdown timed out, forcing shutdown.');

        process.exit(1);
    }, 30000); // 30 seconds timeout

    try {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                clearTimeout(shutdownTimeout);

                if (error) {
                    loggerService.error(
                        `Failed to close server due to: ${error.message}`
                    );

                    reject(error);
                } else {
                    loggerService.log('Server successfully closed.');

                    resolve();
                }
            });
        });
    } catch (error) {
        throw new Error(`Shutdown failed due to: ${error.message}`);
    }
};

export default initiateGracefulShutdown;

import nodemailer from 'nodemailer';

import configuration from '../configuration/configuration.js';
import logger from '../utilities/logger.js';

let transporter;
let retryCount = 0;

/**
 * Initializes the email service by creating a transporter object.
 * This function should be called once during the application startup.
 * It includes retries on failure to ensure the transporter connects to the SMTP server.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} A promise that resolves when the transporter is created successfully.
 */
const connect = async () => {
    if (transporter) {
        logger.info('Email service already initialized.');

        return;
    }

    const connectTransporter = async () => {
        try {
            transporter = nodemailer.createTransport({
                host: configuration.email.smtp.host,
                port: configuration.email.smtp.port,
                secure: false, // Use TLS. When false, connection will use upgraded TLS (if available) via STARTTLS command.
                auth: {
                    user: configuration.email.smtp.auth.user,
                    pass: configuration.email.smtp.auth.pass,
                },
            });

            // Verify connection configuration
            await transporter.verify();

            // Logging real connection details from the transporter
            const connectionDetails = transporter.options; // Accessing actual options used by the transporter

            logger.info(`Email service connected successfully with: Host: ${connectionDetails.host}, Port: ${connectionDetails.port}, Secure: ${connectionDetails.secure}`);

        } catch (error) {
            logger.error(`Failed to connect to email service on attempt ${retryCount + 1}:`, error);

            if (retryCount < configuration.email.smtp.maxConnectionAttempts) {
                retryCount++;

                logger.info(`Retrying to connect (${retryCount}/${configuration.email.smtp.maxConnectionAttempts})...`);

                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
                await connectTransporter();
            } else {
                throw new Error('Failed to initialize email service after several attempts.');
            }
        }
    };

    await connectTransporter();
};

/**
 * Sends an email using the initialized transporter.
 *
 * @async
 * @function sendEmail
 * @param {string} emailAddress - The receiver's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully.
 */
const sendEmail = async (emailAddress, subject, html) => {
    try {
        if (!transporter) {
            throw new Error('Email transporter is not initialized');
        }

        return await transporter.sendMail({
            from: configuration.email.smtp.auth.user,
            to: emailAddress,
            subject,
            html,
        });
    } catch (error) {
        logger.error('Failed to send email:', error);

        throw error;
    }
};

const EmailService = {
    connect,
    sendEmail,
};

export default EmailService;

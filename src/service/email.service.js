import nodemailer from 'nodemailer';
import configuration from '../configuration/configuration.js';

let transporter;

/**
 * Initializes the email service by creating a transporter object.
 * This function should be called once during the application startup.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} A promise that resolves when the transporter is created successfully.
 */
const connect = async () => {
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

        console.info(`Email service connected to host: ${configuration.email.smtp.host}, port: ${configuration.email.smtp.port}`);
    } catch (error) {
        console.error('Failed to initialize email service:', error);

        throw error;
    }
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
        console.error('Failed to send email:', error);

        throw error;
    }
};

const EmailService = {
    connect,
    sendEmail,
};

export default EmailService;

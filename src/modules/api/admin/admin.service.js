import bcrypt from 'bcrypt';

import AdminModel from './admin.model.js';
import sendResponse from '../../../utilities/sendResponse.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import validateEmail from '../../../utilities/validateEmail.js';
import generateVerificationToken
    from '../../../utilities/generateVerificationToken.js';
import configuration from '../../../configuration/configuration.js';
import environment from '../../../constant/envTypes.constants.js';
import prepareEmailContent from '../../../shared/prepareEmailContent.js';
import EmailService from '../../../service/email.service.js';
import prepareEmail from '../../../shared/prepareEmail.js';
import errorResponse from '../../../utilities/errorResponse.js';
import validateAdminRequest from '../../../utilities/validateAdminRequest.js';
import generateHashedToken from '../../../utilities/generateHashedToken.js';
import comparePassword from '../../../utilities/comparePassword.js';
import validatePassword from '../../../utilities/validatePassword.js';
import createHashedPassword from '../../../utilities/createHashedPassword.js';
import getRequestedDeviceDetails
    from '../../../utilities/getRequestedDeviceDetails.js';
import decodeAuthenticationToken
    from '../../../utilities/decodeAuthenticationToken.js';
import generateTempPassword from '../../../utilities/generateTempPassword.js';
import createAuthenticationToken
    from '../../../utilities/createAuthenticationToken.js';
import UsersModel from '../users/users.model.js';
import loggerService from '../../../service/logger.service.js';

const createAdmin = async (requester, adminData, hostData) => {
    try {
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized.',
                httpStatus.FORBIDDEN
            );
        }

        const existingAdmin = await AdminModel.findOne({
            email: adminData.email,
        }).lean();
        if (existingAdmin) {
            return sendResponse(
                {},
                'This email address is already registered. Please log in or use the forgot password option if you need to recover your password.',
                httpStatus.CONFLICT
            );
        }

        const existingUser = await UsersModel.findOne({
            email: adminData.email,
        }).lean();
        if (existingUser) {
            return sendResponse(
                {},
                'This email address is already registered as user. Can not be a user and admin at the same time.',
                httpStatus.FORBIDDEN
            );
        }

        const emailValidationResult = await validateEmail(adminData.email);
        if (emailValidationResult !== 'Valid') {
            return sendResponse({}, emailValidationResult, httpStatus.BAD_REQUEST);
        }

        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        const newUser = await AdminModel.create({
            ...adminData,
            emailVerifyToken,
            emailVerifyTokenExpires,
        });

        const subject = 'Confirm Your Email Address';
        let emailVerificationLink;
        let resendEmailVerificationLink;

        if (configuration.env === environment.PRODUCTION) {
            emailVerificationLink = `https://${hostData.hostname}/api/v1/auth/admin/verify/${plainToken}`;
            resendEmailVerificationLink = `https://${hostData.hostname}/api/v1/auth/admin/resend-verification/${newUser._id}`;
        } else {
            emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/admin/verify/${plainToken}`;
            resendEmailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/admin/resend-verification/${newUser._id}`;
        }

        const emailData = {
            emailVerificationLink,
            resendEmailVerificationLink,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            adminData.email,
            subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        return sendResponse(
            newUser,
            'Admin created successfully. Please verify your email.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create admin: ${error}`);

        return errorResponse(
            error.message || 'Failed to create admin.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const verify = async (token, hostData) => {
    try {
        // Hash the plain token to compare with the stored hash
        const hashedToken = await generateHashedToken(token);
        const adminDetails = await AdminModel.findOne({
            emailVerifyToken: hashedToken,
            emailVerifyTokenExpires: { $gt: Date.now() }, // Check if the token hasn't expired
        });

        if (!adminDetails) {
            return errorResponse(
                'The verification link is invalid or has expired. Please requestBooks a new verification email.',
                httpStatus.FORBIDDEN
            );
        }

        // Set the email verified flag to true and clear the verification token fields
        adminDetails.isEmailVerified = true;
        adminDetails.emailVerifyToken = undefined;
        adminDetails.emailVerifyTokenExpires = undefined;

        // Generate a temporary password
        const tempPassword = generateTempPassword(8, 12);
        // Save the hashed temporary password and set mustChangePassword to true
        adminDetails.password = await bcrypt.hash(tempPassword, 10);
        adminDetails.mustChangePassword = true;

        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        // Update user with the reset password verification token and its expiry
        adminDetails.resetPasswordVerifyToken = emailVerifyToken;
        adminDetails.resetPasswordVerifyTokenExpires = emailVerifyTokenExpires;

        await adminDetails.save();

        let emailVerificationLink;

        if (configuration.env === environment.PRODUCTION) {
            emailVerificationLink = `https://${hostData.hostname}/api/v1/auth/admin/reset-password/${plainToken}`;
        } else {
            emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/admin/reset-password/${plainToken}`;
        }

        const subject = 'Welcome Admin';
        const emailData = {
            userName: adminDetails.name,
            emailVerificationLink,
            tempPassword,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            adminDetails.email,
            subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        return sendResponse(
            {},
            'Email has been successfully verified.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to verify admin: ${error}`);

        return errorResponse(
            error.message || 'Failed to verify admin.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const resendVerification = async (adminId, hostData) => {
    try {
        const adminDetails = await AdminModel.findById(adminId);
        if (!adminDetails) {
            return errorResponse('Admin not found.', httpStatus.NOT_FOUND);
        }

        if (adminDetails.isEmailVerified) {
            return errorResponse(
                'This email address has already been verified. No further action is required.',
                httpStatus.FORBIDDEN
            );
        }

        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        // Update the user with new verification token and expiry
        adminDetails.emailVerifyToken = emailVerifyToken;
        adminDetails.emailVerifyTokenExpires = emailVerifyTokenExpires;

        await adminDetails.save();

        const subject = 'Confirm Your Email Address';
        let emailVerificationLink;
        let resendEmailVerificationLink;

        if (configuration.env === environment.PRODUCTION) {
            emailVerificationLink = `https://${hostData.hostname}/api/v1/auth/admin/verify/${plainToken}`;
            resendEmailVerificationLink = `https://${hostData.hostname}/api/v1/auth/admin/resend-verification/${adminDetails._id}`;
        } else {
            emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/admin/verify/${plainToken}`;
            resendEmailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/admin/resend-verification/${adminDetails._id}`;
        }

        const emailData = {
            emailVerificationLink,
            resendEmailVerificationLink,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            adminDetails.email,
            subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        return sendResponse(
            {},
            'Verification email resent successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to resend verification: ${error}`);

        return errorResponse(
            error.message || 'Failed to resend verification.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const requestNewPassword = async (email, hostData) => {
    try {
        const adminDetails = await AdminModel.findOne({
            email,
        }).lean();
        if (!adminDetails) {
            return errorResponse(
                'No account found with that email address. Please check your email address or register for a new account.',
                httpStatus.NOT_FOUND
            );
        }

        if (!adminDetails.isEmailVerified) {
            return errorResponse(
                'Your email address has not been verified yet. Please verify your email to proceed with password reset.',
                httpStatus.UNAUTHORIZED
            );
        }

        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        // Update user with the reset password verification token and its expiry
        await AdminModel.updateOne(
            { _id: adminDetails._id },
            {
                resetPasswordVerifyToken: emailVerifyToken,
                resetPasswordVerifyTokenExpires: emailVerifyTokenExpires,
            }
        );

        const subject = 'Reset Your Password';
        let emailVerificationLink;

        if (configuration.env === environment.PRODUCTION) {
            emailVerificationLink = `https://${hostData.hostname}/api/v1/auth/admin/reset-password/${plainToken}`;
        } else {
            emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/admin/reset-password/${plainToken}`;
        }

        const emailData = {
            userName: adminDetails.name,
            resetPasswordVerificationLink: emailVerificationLink,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            adminDetails.email,
            subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        return sendResponse(
            {},
            'Password reset email sent successfully. Please check your email.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to request password: ${error}`);

        return errorResponse(
            error.message || 'Failed to request password.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const resetPassword = async (hostData, token, adminData) => {
    try {
        // Hash the plain token to compare with the stored hash
        const hashedToken = await generateHashedToken(token);
        const adminDetails = await AdminModel.findOne({
            resetPasswordVerifyToken: hashedToken,
            resetPasswordVerifyTokenExpires: { $gt: Date.now() }, // Check if the token hasn't expired
        });
        if (!adminDetails) {
            return errorResponse(
                'Your password reset link is invalid or has expired. Please requestBooks a new password reset link.',
                httpStatus.FORBIDDEN
            );
        }

        if (!adminDetails.password) {
            return errorResponse(
                'Please set your password first.',
                httpStatus.FORBIDDEN
            );
        }

        const isPasswordValid = await comparePassword(
            adminData.oldPassword,
            adminDetails.password
        );
        if (!isPasswordValid) {
            return errorResponse(
                'Wrong old password. Please try again.',
                httpStatus.BAD_REQUEST
            );
        }

        if (adminData.newPassword !== adminData.confirmNewPassword) {
            return errorResponse(
                'The new passwords do not match. Please try again.',
                httpStatus.BAD_REQUEST
            );
        }

        const passwordValidationResult = await validatePassword(
            adminData.newPassword
        );
        if (passwordValidationResult !== 'Valid') {
            return sendResponse(
                {},
                passwordValidationResult,
                httpStatus.BAD_REQUEST
            );
        }

        // Update the user with new password and expiry
        adminDetails.password = await createHashedPassword(adminData.newPassword);
        adminDetails.mustChangePassword = false;
        adminDetails.resetPasswordVerifyToken = undefined;
        adminDetails.resetPasswordVerifyTokenExpires = undefined;

        await adminDetails.save();

        const subject = 'Reset Password Successful';
        const emailData = {
            userName: adminDetails.name,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            adminDetails.email,
            subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        return sendResponse({}, 'Reset Password Successful.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to reset password. ${error}`);

        return errorResponse(
            error.message || 'Failed to reset password.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const login = async (adminData, userAgent, device) => {
    try {
        const adminDetails = await AdminModel.findOne({
            email: adminData.email,
        }).lean();
        if (!adminDetails) {
            return errorResponse(
                'No account found with that email address. Please check your email address or register for a new account.',
                httpStatus.NOT_FOUND
            );
        }

        if (!adminDetails.isEmailVerified) {
            return errorResponse(
                'Please verify your email address to proceed with logging in.',
                httpStatus.UNAUTHORIZED
            );
        }

        if (!adminDetails.password) {
            return errorResponse(
                'Please set your password first.',
                httpStatus.FORBIDDEN
            );
        }

        if (adminDetails.mustChangePassword) {
            return errorResponse(
                'Please change your password first.',
                httpStatus.FORBIDDEN
            );
        }

        const isPasswordValid = await comparePassword(
            adminData.password,
            adminDetails.password
        );
        if (!isPasswordValid) {
            adminDetails.login.failed.device.push({
                details: userAgent, // Assuming userAgent is a string
                dateTime: new Date(),
            });

            await AdminModel.findByIdAndUpdate(adminDetails._id, {
                $set: { 'login.failed': adminDetails.login.failed },
            }).lean();

            return errorResponse(
                'Incorrect password. Please try again or use the forgot password option to reset it.',
                httpStatus.UNAUTHORIZED
            );
        }

        // if (userDetails.login.successful.device.length >= configuration.auth.activeSessions) {
        //     return {
        //         timeStamp: new Date(),
        //         success: false,
        //         data: {},
        //         message: `Too many devices used. Can not login more than ${configuration.auth.activeSessions} device at a time. Please log out from an existing device.`,
        //         status: httpStatus.UNAUTHORIZED,
        //     };
        // }

        const { token } = await createAuthenticationToken(
            adminDetails,
            device
        );

        adminDetails.login.successful.device.push({
            details: userAgent, // Assuming userAgent is a string
            dateTime: new Date(),
        });

        await AdminModel.findByIdAndUpdate(adminDetails._id, {
            $set: { 'login.successful': adminDetails.login.successful },
        }).lean();

        const subject = 'Login Successfully';
        const emailData = {
            userName: adminDetails.name,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            adminDetails.email,
            subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        // Remove sensitive data
        delete adminDetails.password;
        delete adminDetails.emailVerifyToken;
        delete adminDetails.emailVerifyTokenExpires;
        delete adminDetails.phoneVerifyToken;
        delete adminDetails.phoneVerifyTokenExpires;
        delete adminDetails.resetPasswordVerifyToken;
        delete adminDetails.resetPasswordVerifyTokenExpires;

        return sendResponse(
            { ...adminDetails, token },
            'User logged in successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to login: ${error}`);

        return errorResponse(
            error.message || 'Failed to login.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const logout = async (req) => {
    try {
        // Assuming these functions are well-defined and return relevant details or throw an error if something goes wrong.
        // const device = await getRequestedDeviceDetails(req);
        const jwtToken = req?.headers['authorization']
            ? req.headers['authorization'].split(' ')[1]
            : null;

        if (!jwtToken) {
            return errorResponse(
                'No authentication token provided.',
                httpStatus.UNAUTHORIZED
            );
        }

        // const tokenData = await decodeAuthenticationToken(jwtToken);

        // You might want to perform actions here such as invalidating the token.
        // Since this is a logout, we need to ensure the token is invalidated if you maintain a list of active tokens.

        return sendResponse(
            {}, // No additional data needed in the successful response.
            'You have been logged out successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to logout: ${error}`);

        return errorResponse(
            error.message || 'Failed to logout.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const adminService = {
    createAdmin,
    verify,
    resendVerification,
    requestNewPassword,
    resetPassword,
    login,
    logout,
};

export default adminService;

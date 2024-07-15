import httpStatus from '../../../constant/httpStatus.constants.js';
import UsersModel from '../users/users.model.js';
import generateVerificationToken from '../../../utilities/generateVerificationToken.js';
import createAuthenticationToken from '../../../utilities/createAuthenticationToken.js';
import prepareEmailContent from '../../../shared/prepareEmailContent.js';
import EmailService from '../../../service/email.service.js';
import configuration from '../../../configuration/configuration.js';
import prepareEmail from '../../../shared/prepareEmail.js';
import generateHashedToken from '../../../utilities/generateHashedToken.js';
import createHashedPassword from '../../../utilities/createHashedPassword.js';
import comparePassword from '../../../utilities/comparePassword.js';
import decodeAuthenticationToken from '../../../utilities/decodeAuthenticationToken.js';
import getRequestedDeviceDetails from '../../../utilities/getRequestedDeviceDetails.js';
import environment from '../../../constant/envTypes.constants.js';
import validateEmail from '../../../utilities/validateEmail.js';
import validatePassword from '../../../utilities/validatePassword.js';
import sendResponse from '../../../utilities/sendResponse.js';
import errorResponse from '../../../utilities/errorResponse.js';
import AdminModel from '../admin/admin.model.js';
import loggerService from '../../../service/logger.service.js';

const signup = async (userData, hostData) => {
    try {
        const existingAdmin = await AdminModel.findOne({
            email: userData.email,
        }).lean();
        if (existingAdmin) {
            return sendResponse(
                {},
                'This email address is already registered as admin. Can not be a user and admin at the same time.',
                httpStatus.FORBIDDEN
            );
        }

        const existingUser = await UsersModel.findOne({
            email: userData.email,
        }).lean();
        if (existingUser) {
            return sendResponse(
                {},
                'This email address is already registered. Please log in or use the forgot password option if you need to recover your password.',
                httpStatus.CONFLICT
            );
        }

        const emailValidationResult = await validateEmail(userData.email);
        if (emailValidationResult !== 'Valid') {
            return sendResponse(
                {},
                emailValidationResult,
                httpStatus.BAD_REQUEST
            );
        }

        if (userData.password !== userData.confirmPassword) {
            return sendResponse(
                {},
                'The passwords you entered do not match. Please try again.',
                httpStatus.BAD_REQUEST
            );
        }

        const passwordValidationResult = await validatePassword(
            userData.password
        );
        if (passwordValidationResult !== 'Valid') {
            return sendResponse(
                {},
                passwordValidationResult,
                httpStatus.BAD_REQUEST
            );
        }

        const hashedPassword = await createHashedPassword(userData.password);
        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        const newUser = await UsersModel.create({
            ...userData,
            password: hashedPassword,
            emailVerifyToken,
            emailVerifyTokenExpires,
        });

        const subject = 'Confirm Your Email Address';
        let emailVerificationLink;
        let resendEmailVerificationLink;

        if (configuration.env === environment.PRODUCTION) {
            emailVerificationLink = `https://${hostData.hostname}/api/v1/auth/verify/${plainToken}`;
            resendEmailVerificationLink = `https://${hostData.hostname}/api/v1/auth/resend-verification/${newUser._id}`;
        } else {
            emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/verify/${plainToken}`;
            resendEmailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/resend-verification/${newUser._id}`;
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
            userData.email,
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
            'User created successfully. Please verify your email.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to signup: ${error}`);

        return errorResponse(
            error.message || 'Failed to signup.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const verify = async (token) => {
    try {
        // Hash the plain token to compare with the stored hash
        const hashedToken = await generateHashedToken(token);
        const userDetails = await UsersModel.findOne({
            emailVerifyToken: hashedToken,
            emailVerifyTokenExpires: { $gt: Date.now() }, // Check if the token hasn't expired
        });

        if (!userDetails) {
            return errorResponse(
                'The verification link is invalid or has expired. Please requestBooks a new verification email.',
                httpStatus.FORBIDDEN
            );
        }

        // Set the email verified flag to true and clear the verification token fields
        userDetails.isEmailVerified = true;
        userDetails.emailVerifyToken = undefined;
        userDetails.emailVerifyTokenExpires = undefined;

        await userDetails.save();

        const subject = 'Welcome Email';
        const emailData = {
            userName: userDetails.name,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            userDetails.email,
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
        loggerService.error(`Failed to verify user: ${error}`);

        return errorResponse(
            error.message || 'Failed to verify user.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const resendVerification = async (userId, hostData) => {
    try {
        const userDetails = await UsersModel.findById(userId);
        if (!userDetails) {
            return errorResponse('User not found.', httpStatus.NOT_FOUND);
        }

        if (userDetails.isEmailVerified) {
            return errorResponse(
                'This email address has already been verified. No further action is required.',
                httpStatus.FORBIDDEN
            );
        }

        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        // Update the user with new verification token and expiry
        userDetails.emailVerifyToken = emailVerifyToken;
        userDetails.emailVerifyTokenExpires = emailVerifyTokenExpires;

        await userDetails.save();

        const subject = 'Confirm Your Email Address';
        let emailVerificationLink;
        let resendEmailVerificationLink;

        if (configuration.env === environment.PRODUCTION) {
            emailVerificationLink = `https://${hostData.hostname}/api/v1/auth/verify/${plainToken}`;
            resendEmailVerificationLink = `https://${hostData.hostname}/api/v1/auth/resend-verification/${userDetails._id}`;
        } else {
            emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/verify/${plainToken}`;
            resendEmailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/resend-verification/${userDetails._id}`;
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
            userDetails.email,
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
        loggerService.error(`Failed to resend verification email: ${error}`);

        return errorResponse(
            error.message || 'Failed to resend verification email.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const requestNewPassword = async (email, hostData) => {
    try {
        const userDetails = await UsersModel.findOne({
            email,
        }).lean();
        if (!userDetails) {
            return errorResponse(
                'No account found with that email address. Please check your email address or register for a new account.',
                httpStatus.NOT_FOUND
            );
        }

        if (!userDetails.isEmailVerified) {
            return errorResponse(
                'Your email address has not been verified yet. Please verify your email to proceed with password reset.',
                httpStatus.UNAUTHORIZED
            );
        }

        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        // Update user with the reset password verification token and its expiry
        await UsersModel.updateOne(
            { _id: userDetails._id },
            {
                resetPasswordVerifyToken: emailVerifyToken,
                resetPasswordVerifyTokenExpires: emailVerifyTokenExpires,
            }
        );

        const subject = 'Reset Your Password';
        let emailVerificationLink;

        if (configuration.env === environment.PRODUCTION) {
            emailVerificationLink = `https://${hostData.hostname}/api/v1/auth/reset-password/${plainToken}`;
        } else {
            emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/reset-password/${plainToken}`;
        }

        const emailData = {
            userName: userDetails.name,
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
            userDetails.email,
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
        loggerService.error(`Failed to request new password: ${error}`);

        return errorResponse(
            error.message || 'Failed to request new password.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const resetPassword = async (hostData, token, userData) => {
    try {
        // Hash the plain token to compare with the stored hash
        const hashedToken = await generateHashedToken(token);
        const userDetails = await UsersModel.findOne({
            resetPasswordVerifyToken: hashedToken,
            resetPasswordVerifyTokenExpires: { $gt: Date.now() }, // Check if the token hasn't expired
        });
        if (!userDetails) {
            return errorResponse(
                'Your password reset link is invalid or has expired. Please requestBooks a new password reset link.',
                httpStatus.FORBIDDEN
            );
        }

        const isPasswordValid = await comparePassword(
            userData.oldPassword,
            userDetails.password
        );
        if (!isPasswordValid) {
            return errorResponse(
                'Wrong old password. Please try again.',
                httpStatus.BAD_REQUEST
            );
        }

        if (userData.newPassword !== userData.confirmNewPassword) {
            return errorResponse(
                'The new passwords do not match. Please try again.',
                httpStatus.BAD_REQUEST
            );
        }

        const passwordValidationResult = await validatePassword(
            userData.newPassword
        );
        if (passwordValidationResult !== 'Valid') {
            return sendResponse(
                {},
                passwordValidationResult,
                httpStatus.BAD_REQUEST
            );
        }

        // Update the user with new password and expiry
        userDetails.password = await createHashedPassword(userData.newPassword);
        userDetails.resetPasswordVerifyToken = undefined;
        userDetails.resetPasswordVerifyTokenExpires = undefined;

        await userDetails.save();

        const subject = 'Reset Password Successful';
        const emailData = {
            userName: userDetails.name,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            userDetails.email,
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
        loggerService.error(`Failed to reset password: ${error}`);

        return errorResponse(
            error.message || 'Failed to reset password.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const login = async (userData, userAgent, device) => {
    try {
        const userDetails = await UsersModel.findOne({
            email: userData.email,
        }).lean();
        if (!userDetails) {
            return errorResponse(
                'No account found with that email address. Please check your email address or register for a new account.',
                httpStatus.NOT_FOUND
            );
        }

        if (!userDetails.isEmailVerified) {
            return errorResponse(
                'Please verify your email address to proceed with logging in.',
                httpStatus.UNAUTHORIZED
            );
        }

        if (userDetails.mustChangePassword) {
            return errorResponse(
                'Please change your password first.',
                httpStatus.FORBIDDEN
            );
        }

        const isPasswordValid = await comparePassword(
            userData.password,
            userDetails.password
        );
        if (!isPasswordValid) {
            userDetails.login.failed.device.push({
                details: userAgent, // Assuming userAgent is a string
                dateTime: new Date(),
            });

            await UsersModel.findByIdAndUpdate(userDetails._id, {
                $set: { 'login.failed': userDetails.login.failed },
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

        const { token } = await createAuthenticationToken(userDetails, device);

        userDetails.login.successful.device.push({
            details: userAgent, // Assuming userAgent is a string
            dateTime: new Date(),
        });

        await UsersModel.findByIdAndUpdate(userDetails._id, {
            $set: { 'login.successful': userDetails.login.successful },
        }).lean();

        const subject = 'Login Successfully';
        const emailData = {
            userName: userDetails.name,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        await EmailService.sendEmail(
            userDetails.email,
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
        delete userDetails.password;
        delete userDetails.emailVerifyToken;
        delete userDetails.emailVerifyTokenExpires;
        delete userDetails.phoneVerifyToken;
        delete userDetails.phoneVerifyTokenExpires;
        delete userDetails.resetPasswordVerifyToken;
        delete userDetails.resetPasswordVerifyTokenExpires;

        return sendResponse(
            { ...userDetails, token },
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

const authService = {
    signup,
    verify,
    resendVerification,
    requestNewPassword,
    resetPassword,
    login,
    logout,
};

export default authService;

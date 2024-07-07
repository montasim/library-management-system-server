import httpStatus from '../../../constant/httpStatus.constants.js';
import UsersModel from '../users/users.model.js';
import userConstants from '../users/users.constants.js';
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
import getAuthenticationToken from '../../../utilities/getAuthenticationToken.js';
import environment from '../../../constant/envTypes.constants.js';

const signup = async (userData, hostData) => {
    try {
        const existingUser = await UsersModel.findOne({
            email: userData.email,
        }).lean();

        if (existingUser) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Email address already taken. Please login.',
                status: httpStatus.CONFLICT,
            };
        }

        if (userData.password !== userData.confirmPassword) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Passwords do not match.',
                status: httpStatus.BAD_REQUEST,
            };
        }

        if (userData.password.length < userConstants.lengths.PASSWORD_MIN) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: `Password must be at least ${userConstants.lengths.PASSWORD_MIN} characters long.`,
                status: httpStatus.BAD_REQUEST,
            };
        }

        if (userData.password.length > userConstants.lengths.PASSWORD_MAX) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: `Password must be less than ${userConstants.lengths.PASSWORD_MAX} characters long.`,
                status: httpStatus.BAD_REQUEST,
            };
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

        return {
            timeStamp: new Date(),
            success: true,
            data: { ...newUser.toObject() },
            message: 'User created successfully. Please verify your email.',
            status: httpStatus.CREATED,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error creating the user.',
            status: httpStatus.BAD_REQUEST,
        };
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
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Verification token is invalid or has expired.',
                status: httpStatus.FORBIDDEN,
            };
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

        return {
            timeStamp: new Date(),
            success: true,
            data: {},
            message: 'Email has been successfully verified.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error verifying the token.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

const resendVerification = async (userId, hostData) => {
    try {
        const userDetails = await UsersModel.findById(userId);

        if (!userDetails) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'User not found.',
                status: httpStatus.NOT_FOUND,
            };
        }

        if (userDetails.isEmailVerified) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Email already verified.',
                status: httpStatus.FORBIDDEN,
            };
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

        return {
            timeStamp: new Date(),
            success: true,
            data: {},
            message: 'Verification email resent successfully.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error processing your request.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

const requestNewPassword = async (email, hostData) => {
    try {
        const userDetails = await UsersModel.findOne({
            email,
        }).lean();

        if (!userDetails) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'User not found. Please sign up first.',
                status: httpStatus.NOT_FOUND,
            };
        }

        if (!userDetails.isEmailVerified) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message:
                    'Your email address is not verified. Please verify your email first.',
                status: httpStatus.UNAUTHORIZED,
            };
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

        return {
            timeStamp: new Date(),
            success: true,
            data: {},
            message:
                'Password reset email sent successfully. Please check your email.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error processing your request.',
            status: httpStatus.BAD_REQUEST,
        };
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
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Verification token is invalid or has expired.',
                status: httpStatus.FORBIDDEN,
            };
        }

        const isPasswordValid = await comparePassword(
            userData.oldPassword,
            userDetails.password
        );

        if (!isPasswordValid) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Invalid credentials.',
                status: httpStatus.UNAUTHORIZED,
            };
        }

        if (userData.newPassword !== userData.confirmNewPassword) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Passwords do not match.',
                status: httpStatus.BAD_REQUEST,
            };
        }

        if (userData.newPassword.length < userConstants.lengths.PASSWORD_MIN) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: `Password must be at least ${userConstants.lengths.PASSWORD_MIN} characters long.`,
                status: httpStatus.BAD_REQUEST,
            };
        }

        if (userData.newPassword.length > userConstants.lengths.PASSWORD_MAX) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: `Password must be less than ${userConstants.lengths.PASSWORD_MAX} characters long.`,
                status: httpStatus.BAD_REQUEST,
            };
        }

        const hashedPassword = await createHashedPassword(userData.newPassword);

        // Update the user with new password and expiry
        userDetails.password = hashedPassword;
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

        return {
            timeStamp: new Date(),
            success: true,
            data: {},
            message: 'Reset Password Successful.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error processing your request.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

const login = async (userData, userAgent, device) => {
    try {
        const userDetails = await UsersModel.findOne({
            email: userData.email,
        }).lean();

        if (!userDetails) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'User not found. Please sign up first.',
                status: httpStatus.NOT_FOUND,
            };
        }

        if (!userDetails.isEmailVerified) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message:
                    'Your email address is not verified. Please verify your email first.',
                status: httpStatus.UNAUTHORIZED,
            };
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

            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Invalid credentials.',
                status: httpStatus.UNAUTHORIZED,
            };
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

        const { token, tokenDetails } = await createAuthenticationToken(
            userDetails,
            device
        );

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

        return {
            timeStamp: new Date(),
            success: true,
            data: { ...userDetails, token },
            message: 'User logged in successfully.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error creating the user.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const logout = async (req) => {
    try {
        const device = await getRequestedDeviceDetails(req);
        const jwtToken = await getAuthenticationToken(
            req?.headers['authorization']
        );
        const tokenData = await decodeAuthenticationToken(jwtToken);

        return {
            timeStamp: new Date(),
            success: true,
            data: {},
            message: 'User logged out successfully.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error logout the user.',
            status: httpStatus.BAD_REQUEST,
        };
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

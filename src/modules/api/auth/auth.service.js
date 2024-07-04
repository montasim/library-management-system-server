import bcrypt from 'bcrypt';
import crypto from 'crypto';

import httpStatus from '../../../constant/httpStatus.constants.js';
import UsersModel from '../users/users.model.js';
import userConstants from '../users/users.constants.js';
import generateVerificationToken from '../../../utilities/generateVerificationToken.js';
import createAuthenticationToken from '../../../utilities/createAuthenticationToken.js';
import prepareEmailContent from '../../../shared/prepareEmailContent.js';
import EmailService from '../../../service/email.service.js';
import configuration from '../../../configuration/configuration.js';
import prepareEmail from '../../../shared/prepareEmail.js';

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

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        const newUser = await UsersModel.create({
            ...userData,
            password: hashedPassword,
            emailVerifyToken,
            emailVerifyTokenExpires,
        });

        const subject = 'Confirm Your Email Address';
        const emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/verify/${plainToken}`;
        const resendEmailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/resend-verification/${newUser._id}`;
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
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const userDetails = await UsersModel.findOne({
            emailVerifyToken: hashedToken,
            emailVerifyTokenExpires: { $gt: Date.now() }, // Check if the token hasn't expired
        });

        if (!userDetails) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Verification token is invalid or has expired',
                status: httpStatus.BAD_REQUEST,
            };
        }

        // Set the email verified flag to true and clear the verification token fields
        userDetails.isEmailVerified = true;
        userDetails.emailVerifyToken = undefined;
        userDetails.emailVerifyTokenExpires = undefined;

        await userDetails.save();

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
                status: httpStatus.BAD_REQUEST,
            };
        }

        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();

        // Update the user with new verification token and expiry
        userDetails.emailVerifyToken = emailVerifyToken;
        userDetails.emailVerifyTokenExpires = emailVerifyTokenExpires;

        await userDetails.save();

        const subject = 'Confirm Your Email Address';
        const emailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/verify/${plainToken}`;
        const resendEmailVerificationLink = `http://${hostData.hostname}:${configuration.port}/api/v1/auth/resend-verification/${userDetails._id}`;
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

const login = async (userData, device) => {
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
                message: 'Your email address is not verified.',
                status: httpStatus.UNAUTHORIZED,
            };
        }

        const isPasswordValid = await bcrypt.compare(
            userData.password,
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

        const { token, tokenDetails } = await createAuthenticationToken(
            userDetails,
            device
        );

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

const authService = {
    signup,
    verify,
    resendVerification,
    login,
};

export default authService;

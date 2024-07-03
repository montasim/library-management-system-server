import bcrypt from 'bcrypt';

import httpStatus from '../../../constant/httpStatus.constants.js';
import UsersModel from '../users/users.model.js';
import userConstants from '../users/users.constants.js';
import createAuthenticationToken from '../../../utilities/createAuthenticationToken.js';

const signup = async (userData) => {
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

        const newUser = await UsersModel.create({
            ...userData,
            password: hashedPassword,
        });

        return {
            timeStamp: new Date(),
            success: true,
            data: { ...newUser.toObject() },
            message: 'User created successfully. Please login.',
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

        const { token, tokenDetails } = await createAuthenticationToken(userDetails, device);

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
    login,
};

export default authService;

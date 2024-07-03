import httpStatus from '../../../constant/httpStatus.constants.js';
import UsersModel from '../users/users.model.js';

const signup = async (userData) => {
    try {
        const oldDetails = await UsersModel.findOne({
            email: userData.email,
        }).lean();

        if (oldDetails) {
            throw new Error(`Email "${userData.email}" already taken.`);
        }

        userData.createdBy = 'Admin'; // Hardcoded for now, will be dynamic in future

        const newUser = await UsersModel.create(userData);

        return {
            timeStamp: new Date(),
            success: true,
            data: newUser,
            message: 'User created successfully.',
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

const authService = {
    signup,
};

export default authService;

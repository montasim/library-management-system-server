import UsersModel from '../modules/api/users/users.model.js';

const validateUserRequest = async (requestedBy) => {
    const requestedUserDetails = await UsersModel.exists({ _id: requestedBy });

    return !!requestedUserDetails;
};

export default validateUserRequest;

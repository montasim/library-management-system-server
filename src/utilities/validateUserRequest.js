import UsersModel from '../modules/api/users/users.model.js';

const validateUserRequest = async (requestedBy) => {
    const requestedUserDetails = await UsersModel.findById(requestedBy);

    return !!requestedUserDetails;
};

export default validateUserRequest;

import AdminModel from '../modules/api/admin/admin.model.js';

const validateAdminRequest = async (requestedBy) => {
    const requestedUserDetails = await AdminModel.findById(requestedBy);

    return !!requestedUserDetails;
};

export default validateAdminRequest;

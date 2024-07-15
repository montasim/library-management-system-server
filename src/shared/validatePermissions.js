import PermissionModel from '../modules/api/permissions/permissions.model.js';

const validatePermissions = async (permissions) => {
    const validPermissions = await PermissionModel.find({
        _id: { $in: permissions },
    }).select('_id');

    return validPermissions.length === permissions.length;
};

export default validatePermissions;

const getRequesterPermissions = (req) => {
    return req.sessionUser.currentUser.permissions;
};

export default getRequesterPermissions;

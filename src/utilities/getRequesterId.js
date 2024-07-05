const getRequesterId = (req) => {
    return req.sessionUser.currentUser._id;
};

export default getRequesterId;

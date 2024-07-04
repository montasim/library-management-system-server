import getAuthenticationToken from '../utilities/getAuthenticationToken.js';
import httpStatus from '../constant/httpStatus.constants.js';
import decodeAuthenticationToken from '../utilities/decodeAuthenticationToken.js';
import UsersModel from '../modules/api/users/users.model.js';

const authenticateMiddleware = async (req, res, next) => {
    const token = await getAuthenticationToken(req?.headers['authorization']);

    if (!token) {
        const forbiddenData = {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Access forbidden. No token provided.',
            status: httpStatus.FORBIDDEN,
            route: req.originalUrl,
        };

        return res.status(forbiddenData.status).send(forbiddenData);
    }

    try {
        const decodedData = await decodeAuthenticationToken(token);

        const userDetails = await UsersModel.findById(
            decodedData.currentUser._id
        );

        if (!userDetails) {
            const unauthorizedData = {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Unauthorized access.',
                status: httpStatus.UNAUTHORIZED,
                route: req.originalUrl,
            };

            return res.status(unauthorizedData.status).send(unauthorizedData);
        }

        req.sessionUser = decodedData;

        next();
    } catch (error) {
        const forbiddenData = {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Access forbidden. Invalid token.',
            status: httpStatus.FORBIDDEN,
            route: req.originalUrl,
        };

        return res.status(forbiddenData.status).send(forbiddenData);
    }
};

export default authenticateMiddleware;

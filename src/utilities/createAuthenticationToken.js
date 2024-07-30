import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import configuration from '../configuration/configuration.js';

const createAuthenticationToken = async (userDetails, permissions, device) => {
    try {
        const tokenDetails = {
            tokenId: uuidv4(),
            expiry: new Date(
                Date.now() +
                    configuration.jwt.accessExpirationMinutes * 60 * 1000
            ),
            currentUser: {
                _id: userDetails._id,
                permissions,
                device,
            },
        };

        const token = jwt.sign(tokenDetails, configuration.jwt.secret, {
            expiresIn: `${configuration.jwt.accessExpirationMinutes}h`,
        });

        return { token, tokenDetails };
    } catch (error) {
        return error;
    }
};

export default createAuthenticationToken;

import jwt from 'jsonwebtoken';

import configuration from '../configuration/configuration.js';

const verifyAuthenticationToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, configuration.jwt.secret, (err, decodedToken) => {
            if (err) {
                reject(err);  // Token verification failed (e.g., token is expired or invalid)
            } else {
                resolve(decodedToken);  // Return the decoded token data
            }
        });
    });
};

// Example usage:
const decodeAuthenticationToken = async (token) => {
    return  await verifyAuthenticationToken(token);
};

export default decodeAuthenticationToken;

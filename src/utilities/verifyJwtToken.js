import jwt from 'jsonwebtoken';

import configuration from '../configuration/configuration.js';

const verifyJwtToken = (token) => {
    return jwt.verify(token, configuration.jwt.secret);
};

export default verifyJwtToken;

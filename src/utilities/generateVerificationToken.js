import crypto from 'crypto';

import generateHashedToken from './generateHashedToken.js';

const generateVerificationToken = async () => {
    const verifyToken = crypto.randomBytes(20).toString('hex');
    const emailVerifyToken = await generateHashedToken(verifyToken);
    const emailVerifyTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

    return {
        emailVerifyToken,
        emailVerifyTokenExpires,
        plainToken: verifyToken, // Return the plain token for use in the verification URL
    };
};

export default generateVerificationToken;

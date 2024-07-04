import crypto from 'crypto';

const generateHashedToken = async (token) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return hashedToken;
};

export default generateHashedToken;

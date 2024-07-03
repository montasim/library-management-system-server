import crypto from 'crypto';

const generateVerificationToken = async () => {
    const verifyToken = crypto.randomBytes(20).toString('hex');
    const emailVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
    const emailVerifyTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

    return {
        emailVerifyToken,
        emailVerifyTokenExpires,
        plainToken: verifyToken // Return the plain token for use in the verification URL
    };
};

export default generateVerificationToken;

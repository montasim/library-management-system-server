import bcrypt from 'bcrypt';

const createHashedPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
};

export default createHashedPassword;

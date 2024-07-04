import bcrypt from 'bcrypt';

const createHashedPassword = async (password) => {
    await bcrypt.hash(password, 10)
};

export default createHashedPassword;

import validateWithSchema from '../../../shared/validateWithSchema.js';
import usersSchema from './users.schema.js';

const updateUser = validateWithSchema([
    {
        schema: usersSchema.updateUser,
        property: 'body',
    },
]);
const deleteUser = validateWithSchema([
    {
        schema: usersSchema.deleteUser,
        property: 'body',
    },
]);

const authValidator = {
    updateUser,
    deleteUser,
};

export default authValidator;

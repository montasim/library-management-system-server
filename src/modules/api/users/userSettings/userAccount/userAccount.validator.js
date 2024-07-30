import validateWithSchema from '../../../../../shared/validateWithSchema.js';
import usersSchema from '../../users.schema.js';

const deleteAccount = validateWithSchema([
    {
        schema: usersSchema.deleteUser,
        property: 'body',
    },
]);

const usersAccountValidator = {
    deleteAccount,
};

export default usersAccountValidator;

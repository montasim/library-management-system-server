import validateWithSchema from '../../../shared/validateWithSchema.js';
import usersSchema from './users.schema.js';

const update = validateWithSchema([
    {
        schema: usersSchema.update,
        property: 'body',
    },
]);

const authValidator = {
    update,
};

export default authValidator;

import validateWithSchema from '../../../../../shared/validateWithSchema.js';
import usersSchema from '../../users.schema.js';

const updateProfile = validateWithSchema([
    {
        schema: usersSchema.updateUserProfile,
        property: 'body',
    },
]);
const usersProfileValidator = {
    updateProfile,
};

export default usersProfileValidator;

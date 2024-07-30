import validateWithSchema from '../../../../../shared/validateWithSchema.js';
import usersSchema from '../../users.schema.js';

const updateAppearance = validateWithSchema([
    {
        schema: usersSchema.updateAppearance,
        property: 'body',
    },
]);
const userAppearanceValidator = {
    updateAppearance,
};

export default userAppearanceValidator;

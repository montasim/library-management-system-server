import mongoose from 'mongoose';

const objectIdValidator = (value, helpers, property) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message(`Invalid ID format for ${property}.`);
    }

    return value;
};

const customObjectIdValidator = (property) => {
    return (value, helpers) => objectIdValidator(value, helpers, property);
};

export default customObjectIdValidator;

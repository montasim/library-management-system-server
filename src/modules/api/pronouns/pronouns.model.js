import mongoose from 'mongoose';
import pronounsConstants from './pronouns.constant.js';
import sharedSchema from '../../../shared/schema.js';

const { Schema } = mongoose;

const pronounsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            sparse: true,
            unique: true,
            required: [true, 'Please provide a name for the pronouns.'],
            match: [
                pronounsConstants.pattern.NAME,
                'Invalid format for pronouns. Please use only alphabetic characters and spaces, e.g., "Male", "Female".',
            ],
            minlength: [
                pronounsConstants.lengths.NAME_MIN,
                `Pronouns name must be at least ${pronounsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                pronounsConstants.lengths.NAME_MAX,
                `Pronouns name cannot exceed ${pronounsConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description:
                'The name of the pronouns, representing different gender identities.',
        },
        isActive: sharedSchema.isActiveSchema,
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

const PronounsModel = mongoose.model('Pronouns', pronounsSchema);

export default PronounsModel;

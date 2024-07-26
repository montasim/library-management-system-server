import mongoose from 'mongoose';
import pronounsConstants from './pronouns.constant.js';

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
                'Invalid format for pronouns. Please use only alphabetic characters and spaces, e.g., "Male", "Female".'
            ],
            minlength: [
                pronounsConstants.lengths.NAME_MIN,
                `Pronouns name must be at least ${pronounsConstants.lengths.NAME_MIN} characters long.`
            ],
            maxlength: [
                pronounsConstants.lengths.NAME_MAX,
                `Pronouns name cannot exceed ${pronounsConstants.lengths.NAME_MAX} characters in length.`
            ],
            description: 'The name of the pronouns, representing different gender identities.',
        },
        isActive: {
            type: Boolean,
            default: true,
            description: 'Indicates whether the pronouns are active and should be displayed in user options.',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: 'AdminsModel',
            required: [true, 'Creator of the pronoun must be specified.'],
            description: 'The ID of the admin who created this pronoun entry.',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: 'AdminsModel',
            required: [true, 'Updater of the pronoun must be specified.'],
            description: 'The ID of the admin who last updated this pronoun entry.',
        },
    },
    {
        timestamps: true,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

const PronounsModel = mongoose.model('Pronouns', pronounsSchema);

export default PronounsModel;

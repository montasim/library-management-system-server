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
                'Invalid format for pronouns. Please use only alphabetic characters and spaces, e.g., "He/Him", "They/Them".'
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

// Pre-save middleware for creation
pronounsSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        return next(new Error('Creator is required.'));
    }

    next();
});

// Pre-update middleware for updates
pronounsSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        return next(new Error('Updater is required.'));
    }

    next();
});

// Error handling middleware for unique constraint violations
pronounsSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Pronouns name already exists.'));
    }

    next(error);
});

pronounsSchema.post('findOneAndUpdate', (error, res, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Pronouns name already exists.'));
    }

    next(error);
});

const PronounsModel = mongoose.model('Pronouns', pronounsSchema);

export default PronounsModel;

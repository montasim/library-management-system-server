import mongoose from 'mongoose';

import privacyPolicyConstants from './privacyPolicy.constant.js';
import sharedSchema from '../../../../shared/schema.js';

const privacyPolicySchema = new mongoose.Schema(
    {
        details: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide content for the privacy policy.'],
            minlength: [
                privacyPolicyConstants.lengths.CONTENT_MIN,
                `PrivacyPolicy content must be at least ${privacyPolicyConstants.lengths.CONTENT_MIN} characters long.`,
            ],
            maxlength: [
                privacyPolicyConstants.lengths.CONTENT_MAX,
                `PrivacyPolicy content cannot exceed ${privacyPolicyConstants.lengths.CONTENT_MAX} characters in length.`,
            ],
            description:
                'The content of the privacy policy. It must be unique and conform to specified length constraints.',
        },
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing privacy policy content with automatic timestamping for creation and updates.',
    }
);

// Create a unique index on the details field
privacyPolicySchema.index({ details: 1 }, { unique: true });

// Check if the model already exists before defining it
const PrivacyPolicyModel =
    mongoose.models.PrivacyPolicy ||
    mongoose.model('PrivacyPolicy', privacyPolicySchema);

export default PrivacyPolicyModel;

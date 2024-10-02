import mongoose from 'mongoose';

import termsAndConditionsConstants from './termsAndConditions.constant.js';
import sharedSchema from '../../../../shared/schema.js';

const termsAndConditionsSchema = new mongoose.Schema(
    {
        details: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide content for the termsAndConditions.'],
            minlength: [
                termsAndConditionsConstants.lengths.CONTENT_MIN,
                `TermsAndConditions content must be at least ${termsAndConditionsConstants.lengths.CONTENT_MIN} characters long.`,
            ],
            maxlength: [
                termsAndConditionsConstants.lengths.CONTENT_MAX,
                `TermsAndConditions content cannot exceed ${termsAndConditionsConstants.lengths.CONTENT_MAX} characters in length.`,
            ],
            description:
                'The content of the termsAndConditions. It must be unique and conform to specified length constraints.',
        },
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing termsAndConditions content with automatic timestamping for creation and updates.',
    }
);

// Create a unique index on the details field
termsAndConditionsSchema.index({ details: 1 }, { unique: true });

// Check if the model already exists before defining it
const TermsAndConditionsModel =
    mongoose.models.TermsAndConditions || mongoose.model('TermsAndConditions', termsAndConditionsSchema);

export default TermsAndConditionsModel;

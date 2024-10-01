import mongoose from 'mongoose';

import aboutUsConstants from './aboutUs.constant.js';
import sharedSchema from '../../../../shared/schema.js';

const aboutUsSchema = new mongoose.Schema(
    {
        details: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide content for the aboutUs.'],
            minlength: [
                aboutUsConstants.lengths.CONTENT_MIN,
                `AboutUs content must be at least ${aboutUsConstants.lengths.CONTENT_MIN} characters long.`,
            ],
            maxlength: [
                aboutUsConstants.lengths.CONTENT_MAX,
                `AboutUs content cannot exceed ${aboutUsConstants.lengths.CONTENT_MAX} characters in length.`,
            ],
            description:
                'The content of the aboutUs. It must be unique and conform to specified length constraints.',
        },
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing aboutUs content with automatic timestamping for creation and updates.',
    }
);

// Create a unique index on the details field
aboutUsSchema.index({ details: 1 }, { unique: true });

// Check if the model already exists before defining it
const AboutUsModel =
    mongoose.models.AboutUs || mongoose.model('AboutUs', aboutUsSchema);

export default AboutUsModel;

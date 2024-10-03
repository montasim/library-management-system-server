import mongoose from 'mongoose';

import siteMapConstants from './siteMap.constant.js';
import sharedSchema from '../../../../shared/schema.js';

const siteMapSchema = new mongoose.Schema(
    {
        details: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [
                true,
                'Please provide content for the siteMap.',
            ],
            minlength: [
                siteMapConstants.lengths.CONTENT_MIN,
                `SiteMap content must be at least ${siteMapConstants.lengths.CONTENT_MIN} characters long.`,
            ],
            maxlength: [
                siteMapConstants.lengths.CONTENT_MAX,
                `SiteMap content cannot exceed ${siteMapConstants.lengths.CONTENT_MAX} characters in length.`,
            ],
            description:
                'The content of the siteMap. It must be unique and conform to specified length constraints.',
        },
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing siteMap content with automatic timestamping for creation and updates.',
    }
);

// Create a unique index on the details field
siteMapSchema.index({ details: 1 }, { unique: true });

// Check if the model already exists before defining it
const SiteMapModel =
    mongoose.models.SiteMap ||
    mongoose.model('SiteMap', siteMapSchema);

export default SiteMapModel;

import mongoose from 'mongoose';

import permissionsConstants from './permissions.constant.js';
import sharedSchema from '../../../shared/schema.js';

const permissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide a name for the permission.'],
            minlength: [
                permissionsConstants.lengths.NAME_MIN,
                `Permission name must be at least ${permissionsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                permissionsConstants.lengths.NAME_MAX,
                `Permission name must not exceed ${permissionsConstants.lengths.NAME_MAX} characters.`,
            ],
            match: [
                permissionsConstants.pattern.name,
                'Invalid permission name format. Please use a valid format.',
            ],
            description:
                'Name of the permission. Must be unique and conform to specified format constraints.',
        },
        isActive: sharedSchema.isActiveSchema,
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

// Create a unique index on the name field
permissionSchema.index({ name: 1 }, { unique: true });

// Pre-save and update middleware
permissionSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

// Error handling middleware for unique constraint violations
permissionSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Permission name already exists.'));
    } else {
        next(error);
    }
});

const PermissionsModel = mongoose.model('Permissions', permissionSchema);

export default PermissionsModel;

import mongoose, { Schema } from 'mongoose';
import permissionsConstants from './permissions.constant.js';
import sharedSchema from '../../../shared/schema.js';

const permissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            unique: [
                true,
                'This permission name is already in use. Please use a different name.',
            ],
            required: [true, 'Permission name is required.'],
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
        timestamps: true, // Automatically adds createdAt and updatedAt timestamps
        versionKey: false, // Disables versioning (__v field)
    }
);

// Middleware for handling unique constraint violations
permissionSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Permission name already exists.'));
    } else {
        next(error);
    }
});

const PermissionsModel = mongoose.model('Permissions', permissionSchema);

export default PermissionsModel;

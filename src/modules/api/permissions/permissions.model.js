import mongoose, { Schema } from 'mongoose';
import permissionsConstants from './permissions.constant.js';

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
                "Name of the permission. Must be unique and conform to specified format constraints.",
        },
        isActive: {
            type: Boolean,
            default: true,
            description:
                'Indicates whether the permission is currently active. Default is true.',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: 'AdminsModel',
            description:
                'Reference to the admin who created this record, used for tracking record ownership.',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: 'AdminsModel',
            description:
                'Reference to the admin who last updated this record, used for tracking changes and record ownership.',
        },
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

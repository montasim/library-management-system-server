import mongoose, { Schema } from 'mongoose';

import rolesConstants from './roles.constant.js';
import sharedSchema from '../../../shared/schema.js';

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Please provide a name for the role.'],
            minlength: [
                rolesConstants.lengths.NAME_MIN,
                `Role name must be at least ${rolesConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                rolesConstants.lengths.NAME_MAX,
                `Role name cannot exceed ${rolesConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description:
                'The name of the role. It must be unique and conform to specified length constraints.',
        },
        permissions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Permissions',
                description: 'Array of associated permissions.',
            },
        ],
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
roleSchema.index({ name: 1 }, { unique: true });

// Pre-save and update middleware
roleSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

// Error handling middleware for unique constraint violations
roleSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Role name already exists.'));
    } else {
        next(error);
    }
});

const RolesModel = mongoose.model('Roles', roleSchema);

export default RolesModel;

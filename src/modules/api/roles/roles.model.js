import mongoose from 'mongoose';
import rolesConstants from './roles.constant.js';

const { Schema } = mongoose;

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Name cannot be empty.'],
            minlength: [
                rolesConstants.lengths.NAME_MIN,
                'Name must be at least 3 characters long.',
            ],
            maxlength: [
                rolesConstants.lengths.NAME_MAX,
                'Name cannot be more than 100 characters long.',
            ],
        },
        permissions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'PermissionModel',
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: String,
            trim: true,
            required: false,
        },
        updatedBy: {
            type: String,
            trim: true,
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Create a unique index on the name field
roleSchema.index({ name: 1 }, { unique: true });

// Pre-save middleware for creation
roleSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        return next(new Error('Creator is required.'));
    }

    next();
});

// Pre-update middleware for updates
roleSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        return next(new Error('Updater is required.'));
    }

    next();
});

// Error handling middleware for unique constraint violations
roleSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Role name already exists.'));
    }

    next(error);
});

roleSchema.post('findOneAndUpdate', function (error, res, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Role name already exists.'));
    }

    next(error);
});

const RolesModel = mongoose.model('Roles', roleSchema);

export default RolesModel;

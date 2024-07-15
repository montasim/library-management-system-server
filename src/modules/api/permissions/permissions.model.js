import mongoose from 'mongoose';
import permissionsConstants from './permissions.constant.js';

const { Schema } = mongoose;

const permissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Name cannot be empty.'],
            minlength: [
                permissionsConstants.lengths.NAME_MIN,
                'Name must be at least 3 characters long.',
            ],
            maxlength: [
                permissionsConstants.lengths.NAME_MAX,
                'Name cannot be more than 100 characters long.',
            ],
            match: [
                permissionsConstants.pattern.name,
                permissionsConstants.message.pattern,
            ],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            trim: true,
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
        },
        updatedBy: {
            trim: true,
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-save middleware for creation
permissionSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        return next(new Error('Creator is required.'));
    }

    next();
});

// Pre-update middleware for updates
permissionSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        return next(new Error('Updater is required.'));
    }

    next();
});

// Error handling middleware for unique constraint violations
permissionSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Permission name already exists.'));
    }

    next(error);
});

permissionSchema.post('findOneAndUpdate', (error, res, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return next(new Error('Permission name already exists.'));
    }

    next(error);
});

const PermissionsModel = mongoose.model('Permissions', permissionSchema);

export default PermissionsModel;

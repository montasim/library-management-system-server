import mongoose, { Schema } from 'mongoose';

import adminActivityLoggerConstants from './adminActivityLogger.constants.js';

const adminActivityLoggerSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'User ID is required for logging activities.'],
            description: 'The ID of the user who performed the action.',
        },
        action: {
            type: String,
            required: [true, 'Action type must be specified.'],
            enum: Object.values(adminActivityLoggerConstants.actionTypes),
            description:
                'Type of action performed. Must be one of the predefined actions.',
        },
        description: {
            type: String,
            required: [true, 'A description of the action is required.'],
            description:
                'A brief description of the action performed by the user.',
        },
        details: {
            type: Schema.Types.Mixed, // Changed to Mixed to allow any data type
            description: 'Additional details about the action in any format.',
        },
        affectedId: [
            {
                type: Schema.Types.ObjectId,
                description:
                    'ID of the entity affected by the action, if applicable.',
            }
        ],
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,
        description:
            'Schema for logging administrative activities, including user actions and system events.',
    }
);

const AdminActivityLoggerModel = mongoose.model(
    'AdminActivityLogger',
    adminActivityLoggerSchema
);

export default AdminActivityLoggerModel;

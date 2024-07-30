import mongoose, { Schema } from 'mongoose';

import subjectsConstants from './subjects.constant.js';
import sharedSchema from '../../../shared/schema.js';

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide a name for the subject.'],
            minlength: [
                subjectsConstants.lengths.NAME_MIN,
                `Subject name must be at least ${subjectsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                subjectsConstants.lengths.NAME_MAX,
                `Subject name cannot exceed ${subjectsConstants.lengths.NAME_MAX} characters in length.`,
            ],
            description: 'The name of the subject. It must be unique and conform to specified length constraints.',
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
subjectSchema.index({ name: 1 }, { unique: true });

// Pre-save and update middleware
subjectSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

// Error handling middleware for unique constraint violations
subjectSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Subject name already exists.'));
    } else {
        next(error);
    }
});


// Check if the model already exists before defining it
const SubjectsModel = mongoose.model('Subjects', subjectSchema);

export default SubjectsModel;

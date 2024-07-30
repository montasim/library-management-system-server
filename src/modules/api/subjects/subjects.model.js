import mongoose from 'mongoose';

import subjectsConstants from './subjects.constant.js';
import sharedSchema from '../../../shared/schema.js';

const { Schema } = mongoose;

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
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
    }
);

// Pre-save middleware for creation
subjectSchema.pre('save', function (next) {
    if (this.isNew && !this.createdBy) {
        next(new Error('Creator is required.'));
    } else {
        next();
    }
});

// Pre-update middleware for updates
subjectSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.updatedBy) {
        next(new Error('Updater is required.'));
    } else {
        next();
    }
});

// Check if the model already exists before defining it
const SubjectsModel = mongoose.model('Subjects', subjectSchema);

export default SubjectsModel;

import mongoose from 'mongoose';

import subjectsConstants from './subjects.constant.js';

const { Schema } = mongoose;

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Name cannot be empty.'],
            minlength: [
                subjectsConstants.lengths.NAME_MIN,
                'Name must be at least 3 character long.',
            ],
            maxlength: [
                subjectsConstants.lengths.NAME_MAX,
                'Name cannot be more than 100 characters long.',
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

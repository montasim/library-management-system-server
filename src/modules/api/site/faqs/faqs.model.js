import mongoose from 'mongoose';

import faqsConstants from './faqs.constant.js';
import sharedSchema from '../../../../shared/schema.js';

const permissionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
            required: [true, 'Please provide a question for the faq.'],
            minlength: [
                faqsConstants.lengths.NAME_MIN,
                `Question must be at least ${faqsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                faqsConstants.lengths.NAME_MAX,
                `Question must not exceed ${faqsConstants.lengths.NAME_MAX} characters.`,
            ],
            description:
                'Question of the faq. Must be unique and conform to specified format constraints.',
        },
        answer: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Please provide a answer for the faq.'],
            minlength: [
                faqsConstants.lengths.NAME_MIN,
                `Answer must be at least ${faqsConstants.lengths.NAME_MIN} characters long.`,
            ],
            maxlength: [
                faqsConstants.lengths.NAME_MAX,
                `Answer must not exceed ${faqsConstants.lengths.NAME_MAX} characters.`,
            ],
            description:
                'Answer of the faq. Must be unique and conform to specified format constraints.',
        },
        isActive: sharedSchema.isActiveSchema,
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing faq data with automatic timestamping for creation and updates.',
    }
);

// Create a unique index on the name field
permissionSchema.index({ question: 1 }, { unique: true });

permissionSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (
        (this.isNew && !this.createdBy) ||
        (this._update && !this._update.updatedBy)
    ) {
        return next(new Error('Creator or updater is required.'));
    }
    next();
});

permissionSchema.post(['save', 'findOneAndUpdate'], (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Faq name already exists.'));
    } else {
        next(error);
    }
});

const FaqsModel = mongoose.model('Faqs', permissionSchema);

export default FaqsModel;

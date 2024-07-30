import UsersModel from '../../users.model.js';
import errorResponse from '../../../../../utilities/errorResponse.js';
import httpStatus from '../../../../../constant/httpStatus.constants.js';
import sendResponse from '../../../../../utilities/sendResponse.js';
import loggerService from '../../../../../service/logger.service.js';
import userConstants from '../../users.constants.js';

const getActivityLog = async (requester) => {
    try {
        const activitiesProjection = {
            activities: {
                $filter: {
                    input: "$activities",
                    as: "activity",
                    cond: {
                        $or: [
                            { $eq: ["$$activity.category", userConstants.activityType.APPEARANCE] },
                            { $eq: ["$$activity.category", userConstants.activityType.PROFILE] }
                        ]
                    }
                }
            }
        };

        const user = await UsersModel.findById(requester, activitiesProjection)
            .lean();

        if (!user) {
            return errorResponse(
                'Unauthorized. Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Now the user object will only contain the filtered activities
        return sendResponse(
            {
                activities: user.activities
            },
            'Activities fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get activities: ${error}`);

        return errorResponse(
            error.message || 'Failed to get activities.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getSecurityLog = async (requester) => {
    try {
        const activitiesProjection = {
            activities: {
                $filter: {
                    input: "$activities",
                    as: "activity",
                    cond: {
                        $or: [
                            { $eq: ["$$activity.category", userConstants.activityType.SECURITY] },
                        ]
                    }
                }
            }
        };

        const user = await UsersModel.findById(requester, activitiesProjection)
            .lean();

        if (!user) {
            return errorResponse(
                'Unauthorized. Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Now the user object will only contain the filtered activities
        return sendResponse(
            {
                activities: user.activities
            },
            'Activities fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get activities: ${error}`);

        return errorResponse(
            error.message || 'Failed to get activities.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getAccountLog = async (requester) => {
    try {
        const activitiesProjection = {
            activities: {
                $filter: {
                    input: "$activities",
                    as: "activity",
                    cond: {
                        $or: [
                            { $eq: ["$$activity.category", userConstants.activityType.ACCOUNT] },
                        ]
                    }
                }
            }
        };

        const user = await UsersModel.findById(requester, activitiesProjection)
            .lean();

        if (!user) {
            return errorResponse(
                'Unauthorized. Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Now the user object will only contain the filtered activities
        return sendResponse(
            {
                activities: user.activities
            },
            'Activities fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get activities: ${error}`);

        return errorResponse(
            error.message || 'Failed to get activities.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const userLogService = {
    getActivityLog,
    getSecurityLog,
    getAccountLog,
};

export default userLogService;

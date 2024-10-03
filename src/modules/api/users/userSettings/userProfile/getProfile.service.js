/**
 * @fileoverview This file defines the service functions for handling operations related to user profiles.
 * The services include methods to retrieve and update user profile details. These functions interact with the `UsersModel`
 * and handle data retrieval, updates, error responses, and logging. Additional utilities are used for file validation and
 * interactions with Google Drive for image uploads.
 */

import { v2 as cloudinary } from 'cloudinary';

import UsersModel from '../../users.model.js';
import httpStatus from '../../../../../constant/httpStatus.constants.js';
import loggerService from '../../../../../service/logger.service.js';
import userConstants from '../../users.constants.js';
import mimeTypesConstants from '../../../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../../../constant/fileExtensions.constants.js';
import configuration from '../../../../../configuration/configuration.js';

import errorResponse from '../../../../../utilities/errorResponse.js';
import sendResponse from '../../../../../utilities/sendResponse.js';
import isEmptyObject from '../../../../../utilities/isEmptyObject.js';
import validateFile from '../../../../../utilities/validateFile.js';

/**
 * Retrieves the profile details for the requesting user.
 *
 * This function fetches the profile details of the authenticated user from the `UsersModel`.
 * It removes sensitive data before returning the user details. If the user is not found or an error occurs,
 * it returns an appropriate error response.
 *
 * @async
 * @function
 * @name getProfile
 * @param {string} userId - The ID of the user requesting the profile details.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the user profile details or an error message.
 */
const getProfile = async (userId) => {
    try {
        // Fetch only the necessary fields and exclude sensitive data directly from the database
        const user = await UsersModel.findById(userId)
            .select(
                '-passwordHash -resetPasswordVerifyToken -resetPasswordVerifyTokenExpires -emails.emailVerifyToken -emails.emailVerifyTokenExpires -mobiles.phoneVerifyToken -mobiles.phoneVerifyTokenExpires -sessions -activities'
            )
            .lean();

        if (!user) {
            return errorResponse(
                'Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        return sendResponse(user, 'User fetched successfully.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to get user details: ${error}`);

        return errorResponse(
            error.message || 'Failed to get user details.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Updates the profile details for the requesting user.
 *
 * This function updates the profile details of the authenticated user in the `UsersModel`.
 * It validates the provided update data and handles image uploads if an image is provided. The function also ensures
 * the user is authenticated and exists. If successful, it returns the updated user data excluding sensitive information.
 * If the user is not found or an error occurs, it returns an appropriate error response.
 *
 * @async
 * @function
 * @name updateProfile
 * @param {string} requester - The ID of the user requesting the update.
 * @param {Object} updateData - The data containing the new profile details.
 * @param {Object} userImage - The image file to be uploaded, if provided.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the updated user profile details or an error message.
 */
const updateProfile = async (requester, updateData, userImage) => {
    try {
        // Fetch the existing user; no need to lean() if updates are to be applied.
        const existingUser = await UsersModel.exists({ _id: requester });
        if (!existingUser) {
            return errorResponse(
                'Unauthorized. Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Validate provided update data
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        // // Optionally, check if the updates are allowed based on the schema
        // const updatesAllowed = ['name', 'bio', 'username']; // Example fields that can be updated
        // const updates = Object.keys(updateData).filter((key) =>
        //     updatesAllowed.includes(key)
        // );
        // if (updates.length === 0) {
        //     return errorResponse(
        //         'Invalid update fields.',
        //         httpStatus.BAD_REQUEST
        //     );
        // }
        //
        // // Create an update object with only allowed fields
        // const updateFields = {};
        // updates.forEach((key) => {
        //     updateFields[key] = updateData[key];
        // });

        // Handle image upload and update if provided
        if (userImage) {
            const fileValidationResults = validateFile(
                userImage,
                userConstants.imageSize,
                [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
                [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
            );

            if (!fileValidationResults.isValid) {
                return errorResponse(
                    fileValidationResults.message,
                    httpStatus.BAD_REQUEST
                );
            }

            cloudinary.config({
                cloud_name: configuration.cloudinary.cloudName,
                api_key: configuration.cloudinary.apiKey,
                api_secret: configuration.cloudinary.apiSecret,
            });

            const file = userImage;
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                {
                    folder: 'library-management-system-server',
                    public_id: file.originalname,
                }
            );

            // Update image data in update object
            updateData.image = {
                fileId: result?.asset_id,
                shareableLink: result?.secure_url,
                downloadLink: result.url,
            };
        }

        // Track who made the update
        updateData.updatedBy = requester;

        // Apply updates to the user document
        const updatedUser = await UsersModel.findByIdAndUpdate(
            { _id: requester },
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        // Remove sensitive data before sending to client
        delete updatedUser.passwordHash;
        delete updatedUser.resetPasswordVerifyToken;
        delete updatedUser.resetPasswordVerifyTokenExpires;
        delete updatedUser.emailVerifyToken;
        delete updatedUser.emailVerifyTokenExpires;

        return sendResponse(
            updatedUser,
            'User updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update user: ${error}`);

        return errorResponse(
            'Failed to update user.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const userProfileService = {
    getProfile,
    updateProfile,
};

export default userProfileService;

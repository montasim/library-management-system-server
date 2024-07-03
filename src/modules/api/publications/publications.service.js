import PublicationsModel from './publications.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';

const createPublication = async (publicationData) => {
    try {
        const oldDetails = await PublicationsModel.findOne({
            name: publicationData.name,
        }).lean();

        if (oldDetails) {
            throw new Error(
                `Publication name "${publicationData.name}" already exists.`
            );
        }

        publicationData.createdBy = 'Admin'; // Hardcoded for now, will be dynamic in future

        const newPublication = await PublicationsModel.create(publicationData);

        return {
            timeStamp: new Date(),
            success: true,
            data: newPublication,
            message: 'Publication created successfully.',
            status: httpStatus.CREATED,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error creating the publication.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getPublications = async (params) => {
    const {
        page = 1,
        limit = 10,
        sort = '-createdAt', // Default sort by most recent creation
        name,
        createdBy,
        updatedBy,
        ...otherFilters
    } = params;

    const query = {};

    // Constructing query filters based on parameters
    if (name) query.name = { $regex: name, $options: 'i' };
    if (createdBy) query.createdBy = { $regex: createdBy, $options: 'i' };
    if (updatedBy) query.updatedBy = { $regex: updatedBy, $options: 'i' };

    try {
        const totalPublications = await PublicationsModel.countDocuments(query);
        const totalPages = Math.ceil(totalPublications / limit);

        // Adjust the limit if it exceeds the total number of publications
        const adjustedLimit = Math.min(
            limit,
            totalPublications - (page - 1) * limit
        );

        const publications = await PublicationsModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(adjustedLimit);

        return {
            timeStamp: new Date(),
            success: true,
            data: {
                publications,
                totalPublications,
                totalPages,
                currentPage: page,
                pageSize: adjustedLimit,
                sort,
            },
            message: publications.length
                ? `${publications.length} publications fetched successfully.`
                : 'No publications found.',
            status: httpStatus.OK,
        };
    } catch (error) {
        logger.error('Error fetching publications:', error);

        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Failed to fetch publications.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

const getPublication = async (publicationId) => {
    const publication = await PublicationsModel.findById(publicationId);

    if (!publication) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Publication not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: publication,
        message: 'Publication fetched successfully.',
        status: httpStatus.OK,
    };
};

const updatePublication = async (publicationId, updateData) => {
    updateData.updatedBy = 'Admin'; // Hardcoded for now, will be dynamic in future

    const updatedPublication = await PublicationsModel.findByIdAndUpdate(
        publicationId,
        updateData,
        {
            new: true,
        }
    );

    if (!updatedPublication) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Publication not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: updatedPublication,
        message: 'Publication updated successfully.',
        status: httpStatus.OK,
    };
};

const deletePublications = async (publicationIds) => {
    const results = {
        deleted: [],
        notFound: [],
        failed: [],
    };

    // Process each publicationId
    for (const publicationId of publicationIds) {
        try {
            const publication =
                await PublicationsModel.findByIdAndDelete(publicationId);
            if (publication) {
                results.deleted.push(publicationId);
            } else {
                results.notFound.push(publicationId);
            }
        } catch (error) {
            // Log the error and mark this ID as failed
            logger.error(
                `Failed to delete publication with ID ${publicationId}: ${error}`
            );
            results.failed.push(publicationId);
        }
    }

    return {
        timeStamp: new Date(),
        success: results.failed.length === 0, // Success only if there were no failures
        data: results,
        message: `Deleted ${results.deleted.length}, Not found ${results.notFound.length}, Failed ${results.failed.length}`,
        status: httpStatus.OK,
    };
};

const deletePublication = async (publicationId) => {
    const publication =
        await PublicationsModel.findByIdAndDelete(publicationId);

    if (!publication) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Publication not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Publication deleted successfully.',
        status: httpStatus.OK,
    };
};

const publicationsService = {
    createPublication,
    getPublications,
    getPublication,
    updatePublication,
    deletePublications,
    deletePublication,
};

export default publicationsService;

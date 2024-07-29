import httpStatus from '../../../constant/httpStatus.constants.js';
import configuration from '../../../configuration/configuration.js';
import sendResponse from '../../../utilities/sendResponse.js';
import errorResponse from '../../../utilities/errorResponse.js';
import loggerService from '../../../service/logger.service.js';

const homeService = async () => {
    try {
        const homeData = {
            message: 'Welcome to the API portal.',
            version: '1.0.0',
            license: 'MIT',
            description: '',
            engines: {
                node: '>=20.x',
                yarn: '>=1.22.x',
            },
            homepage: configuration.github.repository,
            bugs: `${configuration.github.repository}/issues`,
            environment: {
                current: configuration.env,
                apiVersion: configuration.version,
            },
            support: {
                email: 'montasimmamun@gmail.com',
            },
            author: {
                name: 'Mohammad Montasim -Al- Mamun Shuvo',
                email: 'montasimmamun@gmail.com',
                mobile: '+8801722815469',
                linkedin: 'https://www.linkedin.com/in/montasim',
                github: 'https://github.com/montasim',
            },
        };

        return sendResponse(
            homeData,
            'Home data fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get home data: ${error}`);

        return errorResponse(
            error.message || 'Failed to get home data.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

export default homeService;

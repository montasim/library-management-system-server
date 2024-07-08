import httpStatus from '../../../constant/httpStatus.constants.js';
import configuration from '../../../configuration/configuration.js';

const homeService = async () => {
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

    return {
        timeStamp: new Date(),
        success: true,
        data: homeData,
        message: 'Home data fetched successfully.',
        status: httpStatus.OK,
    };
};

export default homeService;

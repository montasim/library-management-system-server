import httpStatus from '../constant/httpStatus.constants.js';

const methodNotSupported = (req, res) => {
    // Extract the methods allowed for the current route
    const methods = req.route.methods;
    const allowedMethods = Object.keys(methods)
        .filter((method) => methods[method] === true && method !== '_all') // Exclude '_all'
        .map((method) => method.toUpperCase())
        .join(', ');

    const methodNotSupportedData = {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: false,
        data: {},
        message: `Method "${req.method}" is not allowed for the requested route. Allowed methods: ${allowedMethods}`,
        status: httpStatus.METHOD_NOT_ALLOWED,
    };

    // Set the Allow header dynamically based on the supported methods
    res.set('Allow', allowedMethods)
        .status(methodNotSupportedData.status)
        .send(methodNotSupportedData);
};

export default methodNotSupported;

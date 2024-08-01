const getHostData = (req) => {
    return {
        hostname: req.hostname,
        port: req.port,
    };
};

export default getHostData;

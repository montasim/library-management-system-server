import expressUseragent from 'express-useragent';
import requestIp from 'request-ip';

const getRequestedDeviceDetails = async (req) => {
    const source = req.headers['user-agent']; // Get the User-Agent header
    const userAgent = expressUseragent.parse(source); // Parse the User-Agent string
    const os = userAgent.os ? userAgent.os : 'Unknown'; // Get the OS details
    const browser = userAgent.browser ? userAgent.browser : 'Unknown'; // Get the browser details
    const version = userAgent.version ? userAgent.version : 'Unknown'; // Get the browser version
    const ip = requestIp.getClientIp(req)
        ? requestIp.getClientIp(req)
        : 'Unknown'; // Get the client's IP address
    const languageHeader = req.headers['accept-language']; // Get the Accept-Language header
    const language = languageHeader
        ? languageHeader.split(',')[0]
        : 'Unknown';
    const device = userAgent.isDesktop
        ? 'Desktop'
        : userAgent.isTablet
            ? 'Tablet'
            : userAgent.isMobile
                ? 'Mobile'
                : 'Unknown';

    return {
        language,
        os,
        ip,
        device,
        browser,
        version,
    };
};

export default getRequestedDeviceDetails;

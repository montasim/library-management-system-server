import expressUseragent from 'express-useragent';
import requestIp from 'request-ip';

const getRequestedDeviceDetails = async (req) => {
    const { headers } = req;
    const userAgentString = headers['user-agent'];
    const userAgent = expressUseragent.parse(userAgentString);

    // Extract device information using destructuring and default values
    const {
        os = 'Unknown',
        browser = 'Unknown',
        version = 'Unknown',
        isDesktop,
        isTablet,
        isMobile,
    } = userAgent;

    // Get client IP address
    const ip = requestIp.getClientIp(req) || 'Unknown';

    // Get preferred language
    const language = headers['accept-language']?.split(',')[0] || 'Unknown';

    // Determine device type
    const device = isDesktop
        ? 'Desktop'
        : isTablet
          ? 'Tablet'
          : isMobile
            ? 'Mobile'
            : 'Unknown';

    return {
        os,
        browser,
        version,
        ip,
        language,
        device,
    };
};

export default getRequestedDeviceDetails;

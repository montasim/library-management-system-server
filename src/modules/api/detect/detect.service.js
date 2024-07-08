import expressUseragent from 'express-useragent';
import requestIp from 'request-ip';
import geoip from 'geoip-lite';

import httpStatus from '../../../constant/httpStatus.constants.js';

const detectService = async (req) => {
    try {
        const source = req.headers['user-agent'];
        const userAgent = expressUseragent.parse(source);
        const ip = requestIp.getClientIp(req);
        const languageHeader = req.headers['accept-language'];
        const referrer = req.headers['referer'] || req.headers['referrer'];
        const cookies = req.headers['cookie']; // Requires parsing if needed

        const geo = geoip.lookup(ip); // Optional: geolocation based on IP

        const detectedData = {
            language: languageHeader ? languageHeader.split(',')[0] : undefined,
            os: userAgent.os,
            ip,
            device: userAgent.isDesktop
                ? 'Desktop'
                : userAgent.isTablet
                  ? 'Tablet'
                  : userAgent.isMobile
                    ? 'Mobile'
                    : 'Unknown',
            browser: userAgent.browser,
            browserVersion: userAgent.version,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer,
            cookies, // Parsing may be needed
            geo, // Geolocation data
        };

        const queryParams = req.query;
        const filteredData =
            Object.keys(queryParams).length > 0
                ? Object.fromEntries(
                      Object.entries(detectedData).filter(
                          ([key]) => queryParams[key] === 'true'
                      )
                  )
                : detectedData;

        return {
            timeStamp: new Date(),
            success: true,
            data: filteredData,
            message: 'Detected successfully.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message:
                'Failed to detect browser details. Please try again later.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

export default detectService;

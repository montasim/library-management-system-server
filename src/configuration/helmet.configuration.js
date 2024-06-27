const helmetConfiguration = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], // Only allow content from the current domain
            scriptSrc: ["'self'"], // Only allow scripts from the current domain
            objectSrc: ["'none'"], // Disallow plugins (Flash, Silverlight, etc.)
            imgSrc: ["'self'"], // Only allow images from the current domain
            styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles and CSS from self
            upgradeInsecureRequests: [], // Upgrade all HTTP requests to HTTPS
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Only send the origin of the document as the referrer in all other cases
};

export default helmetConfiguration;

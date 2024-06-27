const corsMiddleware = {
    origin: (origin, callback) => {
        const whitelist = ['http://localhost:5000', '127.0.01:5000']; // List of allowed origins

        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // This allows the server to send cookies
    preflightContinue: false,
    maxAge: 24 * 60 * 60 // 24 hours
};

export default corsMiddleware;
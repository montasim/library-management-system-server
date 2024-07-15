import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import helmetConfiguration from './configuration/helmet.configuration.js';
import corsConfiguration from './configuration/cors.configuration.js';
import compressionConfiguration from './configuration/compression.configuration.js';
import sanitizeRequestConfiguration from './configuration/sanitizeRequest.configuration.js';

import appRoutes from './routes.js';
import errorHandlingMiddleware from './middleware/errorHandlingMiddleware.js';
import hppConfiguration from './configuration/hpp.configuration.js';
import morganConfiguration from './configuration/morgan.configuration.js';

const app = express();

// Security middleware
app.use(helmet(helmetConfiguration));
app.use(cors(corsConfiguration));
app.use(hppConfiguration());
app.use(compressionConfiguration);

// Morgan HTTP requestBooks loggerService setup
app.use(morganConfiguration);

// Body parsing middleware
app.use(express.json({ limit: '20mb' })); // unified the limit for JSON
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Sanitize requestBooks data
app.use(sanitizeRequestConfiguration);

// Routes
app.use('/', appRoutes);

// Error handling middleware
app.use(errorHandlingMiddleware);

export default app;

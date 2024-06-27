import express from 'express';
import cors from 'cors';

import corsMiddleware from './middleware/cors.middleware.js';

import appRoutes from './routes.js';

const app = express();

app.use(cors(corsMiddleware));

app.use('/', appRoutes);

export default app;

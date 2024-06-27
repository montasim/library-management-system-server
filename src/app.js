import express from 'express';

import appRoutes from "./routes.js";
import undefinedController from "./modules/undefined/undefined.controller.js";

const app = express()

app.use('/', appRoutes)
app.use('*', undefinedController);

export default app;
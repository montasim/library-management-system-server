import express from 'express';

import routesConstants from '../../../constant/routes.constants.js';
import aboutUsRoutes from './aboutUs/aboutUs.routes.js';
import termsAndConditionsRoutes
    from './termsAndConditions/termsAndConditions.routes.js';

const router = express.Router();

// site routes
router.use(`/${routesConstants.aboutUs.routes}`, aboutUsRoutes);
router.use(`/${routesConstants.termsAndConditions.routes}`, termsAndConditionsRoutes);

export default router;

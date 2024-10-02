import express from 'express';

import routesConstants from '../../../constant/routes.constants.js';
import aboutUsRoutes from './aboutUs/aboutUs.routes.js';
import termsAndConditionsRoutes
    from './termsAndConditions/termsAndConditions.routes.js';
import privacyPolicyRoutes from './privacyPolicy/privacyPolicy.routes.js';

const router = express.Router();

// site routes
router.use(`/${routesConstants.aboutUs.routes}`, aboutUsRoutes);
router.use(`/${routesConstants.termsAndConditions.routes}`, termsAndConditionsRoutes);
router.use(`/${routesConstants.privacyPolicy.routes}`, privacyPolicyRoutes);

export default router;

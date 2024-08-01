import express from 'express';

import usersBooksHistoryRoutes from './userBookHistory/usersBooksHistory.routes.js';
import userRequestBooksRoutes from './userRequestBooks/userRequestBooks.routes.js';
import recentlyVisitedBooksRoutes from './recentlyVisitedBooks/recentlyVisitedBooks.routes.js';
import userSettingsRoutes from './userSettings/userSettings.routes.js';
import authenticateMiddleware
    from '../../../middleware/authenticate.middleware.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

router.use('/history', authenticateMiddleware(accessTypesConstants.BOTH), usersBooksHistoryRoutes);
router.use('/recently-visited', authenticateMiddleware(accessTypesConstants.USER), recentlyVisitedBooksRoutes);
router.use('/requested', authenticateMiddleware(accessTypesConstants.USER), userRequestBooksRoutes);
router.use('/settings', authenticateMiddleware(accessTypesConstants.USER), userSettingsRoutes);

export default router;

import express from 'express';

import usersBooksHistoryRoutes from './userBookHistory/usersBooksHistory.routes.js';
import userRequestBooksRoutes from './userRequestBooks/userRequestBooks.routes.js';
import recentlyVisitedBooksRoutes from './recentlyVisitedBooks/recentlyVisitedBooks.routes.js';
import userSettingsRoutes from './userSettings/userSettings.routes.js';

const router = express.Router();

router.use('/history', usersBooksHistoryRoutes);
router.use('/recently-visited', recentlyVisitedBooksRoutes);
router.use('/requested', userRequestBooksRoutes);
router.use('/settings', userSettingsRoutes);

export default router;

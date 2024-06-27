import express from 'express';

import indexRoutes from './modules/index/index.routes.js';
import booksRoutes from './modules/books/books.routes.js';
import undefinedController from './modules/undefined/undefined.controller.js';

const router = express.Router();

router.use('/', indexRoutes);
router.use('/books', booksRoutes);
router.use('*', undefinedController);

export default router;

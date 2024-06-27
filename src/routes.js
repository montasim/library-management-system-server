import express from 'express';

import indexRoutes from "./modules/index/index.routes.js";
import booksRoutes from "./modules/books/books.routes.js";

const router = express.Router();

router.use('/', indexRoutes)
router.use('/books', booksRoutes)

export default router;

import express from 'express';

import booksRoutes from "./modules/books/books.routes.js";

const router = express.Router();

router.use('/books', booksRoutes)

export default router;

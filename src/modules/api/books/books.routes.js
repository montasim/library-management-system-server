import express from 'express';

import booksController from './books.controller.js';

const router = express.Router();

router.get('/', booksController);

export default router;

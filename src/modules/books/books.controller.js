import booksService from './books.service.js';

const booksController = (req, res) => {
    const booksData = booksService(req);

    res.status(booksData.status).send(booksData);
};

export default booksController;

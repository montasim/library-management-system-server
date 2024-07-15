import validateWithSchema from '../../../../shared/validateWithSchema.js';
import recentlyVisitedBooksSchema from './recentlyVisitedBooks.schema.js';

const add = validateWithSchema([
    {
        schema: recentlyVisitedBooksSchema.add,
        property: 'body',
    },
]);

const recentlyVisitedBooksValidator = {
    add,
};

export default recentlyVisitedBooksValidator;

import favouriteBooksService from './favouriteBooks.service.js';
import entity from '../../../../shared/entity.js';
import routesConstants from '../../../../constant/routes.constants.js';

const favouriteBooksController = {
    createFavouriteBook: entity.createEntityWithId(
        favouriteBooksService,
        'createFavouriteBook',
        routesConstants.favouriteBooks.params
    ),
    getFavouriteBooks: entity.getEntityByRequester(
        favouriteBooksService,
        'getFavouriteBooks'
    ),
    deleteFavouriteBook: entity.deleteEntityById(
        favouriteBooksService,
        'deleteFavouriteBook',
        routesConstants.favouriteBooks.params
    ),
};

export default favouriteBooksController;

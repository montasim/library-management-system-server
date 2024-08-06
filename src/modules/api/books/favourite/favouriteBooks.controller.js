import favouriteBooksService from './favouriteBooks.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const favouriteBooksController = {
    createFavouriteBook: controller.createWithId(
        favouriteBooksService,
        'createFavouriteBook',
        routesConstants.favouriteBooks.params
    ),
    getFavouriteBooks: controller.getByRequester(
        favouriteBooksService,
        'getFavouriteBooks'
    ),
    deleteFavouriteBook: controller.deleteById(
        favouriteBooksService,
        'deleteFavouriteBook',
        routesConstants.favouriteBooks.params
    ),
};

export default favouriteBooksController;

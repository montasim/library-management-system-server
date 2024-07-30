import express from 'express';

import pronounsValidator from './pronouns.validator.js';
import pronounsController from './pronouns.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware.admin,
        pronounsValidator.createPronouns,
        pronounsController.createPronouns
    )
    .get(pronounsValidator.getPronounsList, pronounsController.getPronounsList)
    .delete(
        authenticateMiddleware.admin,
        pronounsValidator.deletePronounsList,
        pronounsController.deletePronounsList
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.pronouns.params}`)
    .get(pronounsValidator.getPronounsById, pronounsController.getPronounsById)
    .put(
        authenticateMiddleware.admin,
        pronounsValidator.updatePronounsById,
        pronounsController.updatePronounsById
    )
    .delete(
        authenticateMiddleware.admin,
        pronounsValidator.deletePronounsById,
        pronounsController.deletePronounsById
    )
    .all(methodNotSupported);

export default router;

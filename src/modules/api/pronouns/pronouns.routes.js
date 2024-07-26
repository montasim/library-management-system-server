import express from 'express';

import pronounsValidator from './pronouns.validator.js';
import pronounsController from './pronouns.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import authenticateMiddleware
    from '../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware.admin,
        pronounsValidator.createPronouns,
        pronounsController.createPronouns
    )
    .get(
        pronounsValidator.getPronounses,
        pronounsController.getPronounses
    )
    .delete(
        authenticateMiddleware.admin,
        pronounsValidator.deletePronounses,
        pronounsController.deletePronounses
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.pronouns.params}`)
    .get(
        pronounsValidator.getPronouns,
        pronounsController.getPronouns
    )
    .put(
        authenticateMiddleware.admin,
        pronounsValidator.updatePronouns,
        pronounsController.updatePronouns
    )
    .delete(
        authenticateMiddleware.admin,
        pronounsValidator.deletePronouns,
        pronounsController.deletePronouns
    )
    .all(methodNotSupported);

export default router;

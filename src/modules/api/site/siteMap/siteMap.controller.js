import siteMapService from './siteMap.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const siteMapController = {
    createSiteMap: controller.create(
        siteMapService,
        'createSiteMap'
    ),
    getSiteMap: controller.getList(
        siteMapService,
        'getSiteMap'
    ),
    updateSiteMap: controller.updateById(
        siteMapService,
        'updateSiteMap',
        routesConstants.siteMap.params
    ),
    deleteSiteMap: controller.deleteAll(
        siteMapService,
        'deleteSiteMap'
    ),
};

export default siteMapController;

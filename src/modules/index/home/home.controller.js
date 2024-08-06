import controller from '../../../shared/controller.js';
import homeService from './home.service.js';

const homeController = controller.getList(homeService);

export default homeController;

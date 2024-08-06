import userLogService from './userLog.service.js';
import controller from '../../../../../shared/controller.js';

const userLogController = {
    getActivityLog: controller.updateByRequester(
        userLogService,
        'getActivityLog'
    ),
    getSecurityLog: controller.updateByRequester(
        userLogService,
        'getSecurityLog'
    ),
    getAccountLog: controller.updateByRequester(
        userLogService,
        'getAccountLog'
    ),
};

export default userLogController;

import userLogService from './userLog.service.js';
import entity from '../../../../../shared/entity.js';

const userLogController = {
    getActivityLog: entity.updateEntityByRequester(
        userLogService,
        'getActivityLog'
    ),
    getSecurityLog: entity.updateEntityByRequester(
        userLogService,
        'getSecurityLog'
    ),
    getAccountLog: entity.updateEntityByRequester(
        userLogService,
        'getAccountLog'
    ),
};

export default userLogController;

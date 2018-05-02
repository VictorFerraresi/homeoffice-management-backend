const { Router } = require('restify-router');

import { TaskService } from '../services/task';

const routerInstance = new Router();

routerInstance.get('/tasks', TaskService.getAll);
routerInstance.get('/tasks/:project_name', TaskService.findByProject);

routerInstance.post('/tasks', TaskService.createNew);
routerInstance.post('/tasks/setPriority/', TaskService.setPriority);
routerInstance.post('/tasks/setStatus/', TaskService.setStatus);
routerInstance.post('/tasks/addMember/', TaskService.addMember);
routerInstance.post('/tasks/removeMember/', TaskService.removeMember);

module.exports = routerInstance;

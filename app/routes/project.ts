const { Router } = require('restify-router');

import { ProjectService } from '../services/project';

const routerInstance = new Router();

routerInstance.get('/projects', ProjectService.getAll);
routerInstance.get('/projects/:project_name', ProjectService.find);

routerInstance.post('/projects', ProjectService.createNew);
routerInstance.post('/projects/addMember/', ProjectService.addMember);
routerInstance.post('/projects/removeMember/', ProjectService.removeMember);

module.exports = routerInstance;

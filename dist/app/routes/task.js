"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require('restify-router');
const task_1 = require("../services/task");
const routerInstance = new Router();
routerInstance.get('/tasks', task_1.TaskService.getAll);
routerInstance.get('/tasks/:project_name', task_1.TaskService.findByProject);
routerInstance.post('/tasks', task_1.TaskService.createNew);
routerInstance.post('/tasks/setPriority/', task_1.TaskService.setPriority);
routerInstance.post('/tasks/setStatus/', task_1.TaskService.setStatus);
routerInstance.post('/tasks/addMember/', task_1.TaskService.addMember);
routerInstance.post('/tasks/removeMember/', task_1.TaskService.removeMember);
module.exports = routerInstance;
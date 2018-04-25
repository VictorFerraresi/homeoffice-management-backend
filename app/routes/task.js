const { Router } = require('restify-router');
const TaskService = require('../services/task');

const routerInstance = new Router();

routerInstance.get('/tasks', TaskService.getAll);

routerInstance.post('/tasks', TaskService.createNew);

module.exports = routerInstance;

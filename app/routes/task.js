const { Router } = require('restify-router');
const TaskService = require('../services/task');

const routerInstance = new Router();

routerInstance.get('/tasks', TaskService.getAll);

module.exports = routerInstance;

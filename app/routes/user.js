'use strict';

const Router = require('restify-router').Router,
      UserService = require('../services/user');

var routerInstance = new Router();


routerInstance.get('/users', UserService.getAll);
routerInstance.get('/users/:username', UserService.find);

routerInstance.post('/login', UserService.validatePassword);
routerInstance.post('/register', UserService.tryRegister);

module.exports = routerInstance;

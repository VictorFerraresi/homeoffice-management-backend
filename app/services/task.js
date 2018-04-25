const mongoose = require('mongoose');
const errors = require('restify-errors');
const logger = require('../common/logger');

const Task = mongoose.model('Task');

class TaskService {
  /**
   * Method responsible for returning all the Tasks in the database as a RESTful webservice
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static getAll (req, res, next) {
    Task.find({}, (err, tasks) => {
      if (err) {
        logger.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }
      res.send(tasks);
      next();
    });
  }
}

module.exports = TaskService;

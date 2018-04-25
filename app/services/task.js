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
    Task.find({})
      .populate('project')
      .exec((err, tasks) => {
        if (err) {
          logger.error(err);
          return next(new errors.InvalidContentError(err.errors.name.message));
        }
        res.send(tasks);
        next();
      });
  }

  /**
   * Method responsible for inserting a new Task in the database
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static createNew (req, res, next) {
    let ret;

    if (req.params.name === undefined || req.params.priority === undefined ||
     req.params.project === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      Task.findOne({ name: req.params.name, project: req.params.project })
        .then((newTask) => {
          if (newTask !== null) {
            res.status(203);
            ret = {
              error: {
                code: 203,
                message: 'Já existe uma task com este nome neste projeto.'
              }
            };
            res.send(ret);
          } else {
            const task = new Task({
              name: req.params.name,
              priority: req.params.priority,
              project: mongoose.mongo.ObjectId(req.params.project),
              status: 'unassigned'
            });
            try {
              task.save();
              res.status(200);
              res.send(ret);
            } catch (error) {
              res.status(500);
              ret = {
                error: {
                  code: 500,
                  message: 'Internal Server Error'
                }
              };
              res.send(ret);
              throw error;
            }
          }
        }).catch((error) => {
          res.status(500);
          ret = {
            error: {
              code: 500,
              message: 'Internal Server Error'
            }
          };
          res.send(ret);
          throw error;
        });
    }
  }
}

module.exports = TaskService;

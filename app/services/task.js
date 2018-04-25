const mongoose = require('mongoose');
const errors = require('restify-errors');
const logger = require('../common/logger');

const Task = mongoose.model('Task');
const Project = mongoose.model('Project');
const User = mongoose.model('User');

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
   * Method responsible for returning all the Tasks of a Project as a RESTful webservice
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static findByProject (req, res, next) {
    Project.findOne({ name: req.params.project_name }, (err, proj) => {
      if (err) {
        logger.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }

      if (proj === null) {
        const ret = {
          error: {
            code: 400,
            message: 'Este projeto não existe.'
          }
        };
        res.status(400);
        res.send(ret);
        next();
      } else {
        Task.find({ project: proj._id })
          .populate('project')
          .exec((errB, tasks) => {
            if (errB) {
              logger.error(errB);
              return next(new errors.InvalidContentError(errB.errors.name.message));
            }

            res.send(tasks);
            next();
          });
      }
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

  /**
   * Method responsible for changing a Task's priority
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static setPriority (req, res, next) {
    let ret;

    if (req.params.task === undefined || req.params.priority === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      Task.update(
        { _id: req.params.task },
        { $set: { priority: req.params.priority } }, (err, num) => {
          if (err) {
            logger.error(err);
            return next(new errors.InvalidContentError(err.errors.name.message));
          }

          if (num.nModified === 0) {
            res.status(400);
            ret = {
              error: {
                code: 400,
                message: 'Não foi encontrada uma Task com este ID.'
              }
            };
            res.send(ret);
          } else {
            res.status(200);
            res.send(ret);
          }
        }
      );
    }
  }

  /**
   * Method responsible for changing a Task's status
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static setStatus (req, res, next) {
    let ret;

    if (req.params.task === undefined || req.params.status === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      Task.update(
        { _id: req.params.task },
        { $set: { status: req.params.status } }, (err, num) => {
          if (err) {
            logger.error(err);
            return next(new errors.InvalidContentError(err.errors.name.message));
          }

          if (num.nModified === 0) {
            res.status(400);
            ret = {
              error: {
                code: 400,
                message: 'Não foi encontrada uma Task com este ID.'
              }
            };
            res.send(ret);
          } else {
            res.status(200);
            res.send(ret);
          }
        }
      );
    }
  }

  /**
   * Method responsible for adding a user into a Task
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static addMember (req, res, next) {
    let ret;

    if (req.params.task === undefined || req.params.username === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      User.findOne({ username: req.params.username }, (err, user) => {
        if (err) {
          logger.error(err);
          return next(new errors.InvalidContentError(err.errors.name.message));
        }

        if (user === null) {
          ret = {
            error: {
              code: 400,
              message: 'Este usuário não existe.'
            }
          };
          res.status(400);
          res.send(ret);
          next();
        } else {
          Task.update(
            { _id: req.params.task },
            { $addToSet: { members: user._id } }, (errB, num) => {
              if (errB) {
                logger.error(errB);
                return next(new errors.InvalidContentError(errB.errors.name.message));
              }

              if (num.nModified === 0) {
                res.status(400);
                ret = {
                  error: {
                    code: 400,
                    message: 'Não foi encontrada uma Task com este ID.'
                  }
                };
                res.send(ret);
              } else {
                res.status(200);
                res.send(ret);
              }
            }
          );
        }
      });
    }
  }
}

module.exports = TaskService;

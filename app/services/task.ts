import { mongo } from 'mongoose';
import * as errors from 'restify-errors';
import { logger } from '../common/logger';
import { ErrorResponse } from '../error/error-response';
import { project } from '../models/project';
import { task } from '../models/task';
import { user } from '../models/user';

export class TaskService {
  /**
   * Method responsible for returning all the Tasks in the database as a RESTful webservice
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  public static getAll(req, res, next) {
    task.find({})
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
  public static findByProject(req, res, next) {
    project.findOne({ name: req.params.project_name }, (err, proj) => {
      if (err) {
        logger.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }

      if (proj === null) {
        res.status(400);
        const ret = new ErrorResponse(400, 'Este Projeto não existe.');
        res.send(ret.error);
        next();
      } else {
        task.find({ project: proj._id })
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
  public static createNew(req, res, next) {
    let ret;

    if (req.params.name === undefined || req.params.priority === undefined ||
     req.params.project === undefined) {
      res.status(400);
      ret = new ErrorResponse(400, 'Payload de request inválido.');
      res.send(ret.error);
    } else {
      task.findOne({ name: req.params.name, project: req.params.project })
        .then((newTask) => {
          if (newTask !== null) {
            res.status(203);
            ret = new ErrorResponse(203, 'Já existe uma task com este nome neste projeto.');
            res.send(ret.error);
          } else {
            const tsk = new task({
              name: req.params.name,
              priority: req.params.priority,
              project: new mongo.ObjectId(req.params.project),
              status: 'unassigned',
            });
            try {
              tsk.save();
              res.status(200);
              res.send(ret);
            } catch (error) {
              res.status(500);
              ret = new ErrorResponse(500, 'Internal Server Error.');
              res.send(ret.error);
              throw error;
            }
          }
        }).catch((error) => {
          res.status(500);
          ret = new ErrorResponse(500, 'Internal Server Error.');
          res.send(ret.error);
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
  public static setPriority(req, res, next) {
    let ret;

    if (req.params.task === undefined || req.params.priority === undefined) {
      res.status(400);
      ret = new ErrorResponse(400, 'Payload de request inválido.');
      res.send(ret.error);
    } else {
      task.update(
        { _id: req.params.task },
        { $set: { priority: req.params.priority } }, (err, num) => {
          if (err) {
            logger.error(err);
            return next(new errors.InvalidContentError(err.errors.name.message));
          }

          if (num.nModified === 0) {
            res.status(400);
            ret = new ErrorResponse(400, 'Não foi encontrada uma Task com este ID.');
            res.send(ret.error);
          } else {
            res.status(200);
            res.send(ret);
          }
        },
      );
    }
  }

  /**
   * Method responsible for changing a Task's status
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  public static setStatus(req, res, next) {
    let ret;

    if (req.params.task === undefined || req.params.status === undefined) {
      res.status(400);
      ret = new ErrorResponse(400, 'Payload de request inválido.');
      res.send(ret.error);
    } else {
      task.update(
        { _id: req.params.task },
        { $set: { status: req.params.status } }, (err, num) => {
          if (err) {
            logger.error(err);
            return next(new errors.InvalidContentError(err.errors.name.message));
          }

          if (num.nModified === 0) {
            res.status(400);
            ret = new ErrorResponse(400, 'Não foi encontrada uma Task com este ID.');
            res.send(ret.error);
          } else {
            res.status(200);
            res.send(ret);
          }
        },
      );
    }
  }

  /**
   * Method responsible for adding a user into a Task
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  public static addMember (req, res, next) {
    let ret;

    if (req.params.task === undefined || req.params.username === undefined) {
      res.status(400);
      ret = new ErrorResponse(400, 'Payload de request inválido.');
      res.send(ret.error);
    } else {
      user.findOne({ username: req.params.username }, (err, user) => {
        if (err) {
          logger.error(err);
          return next(new errors.InvalidContentError(err.errors.name.message));
        }

        if (user === null) {
          res.status(400);
          ret = new ErrorResponse(400, 'Este usuário não existe.');
          res.send(ret.error);
          next();
        } else {
          task.update(
            { _id: req.params.task },
            { $addToSet: { members: user._id } }, (errB, num) => {
              if (errB) {
                logger.error(errB);
                return next(new errors.InvalidContentError(errB.errors.name.message));
              }

              if (num.nModified === 0) {
                res.status(400);
                ret = new ErrorResponse(400, 'Não foi encontrada uma Task com este ID.');
                res.send(ret.error);
              } else {
                res.status(200);
                res.send(ret);
              }
            },
          );
        }
      });
    }
  }

  /**
   * Method responsible for removing a user from a Task
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  public static removeMember (req, res, next) {
    let ret;

    if (req.params.task === undefined || req.params.username === undefined) {
      res.status(400);
      ret = new ErrorResponse(400, 'Payload de request inválido.');
      res.send(ret.error);
    } else {
      user.findOne({ username: req.params.username }, (err, user) => {
        if (err) {
          logger.error(err);
          return next(new errors.InvalidContentError(err.errors.name.message));
        }

        if (user === null) {
          res.status(400);
          ret = new ErrorResponse(400, 'Este usuário não existe.');
          res.send(ret.error);
          next();
        } else {
          task.update(
            { _id: req.params.task },
            { $pull: { members: user._id } }, (errB, num) => {
              if (errB) {
                logger.error(errB);
                return next(new errors.InvalidContentError(errB.errors.name.message));
              }

              if (num.nModified === 0) {
                res.status(400);
                ret = new ErrorResponse(400, 'Não foi encontrada uma Task com este ID.');
                res.send(ret.error);
              } else {
                res.status(200);
                res.send(ret);
              }
            },
          );
        }
      });
    }
  }
}

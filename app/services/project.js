const mongoose = require('mongoose');
const errors = require('restify-errors');
const logger = require('../common/logger');

const Project = mongoose.model('Project');

class ProjectService {
  /**
   * Method responsible for returning all the Projects in the database as a RESTful webservice
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static getAll (req, res, next) {
    Project.find({})
      .populate('createdBy')
      .exec((err, projects) => {
        if (err) {
          logger.error(err);
          return next(new errors.InvalidContentError(err.errors.name.message));
        }

        res.send(projects);
        next();
      });
  }

  /**
   * Method responsible for returning a Project by name from the database as a RESTful webservice
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static find (req, res, next) {
    Project.findOne({ name: req.params.project_name })
      .populate('createdBy')
      .exec((err, project) => {
        if (err) {
          logger.error(err);
          return next(new errors.InvalidContentError(err.errors.name.message));
        }

        res.send(project);
        next();
      });
  }

  /**
   * Method responsible for inserting a new Project in the database
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static createNew (req, res, next) {
    let ret;

    if (req.params.name === undefined || req.params.createdBy === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      Project.findOne({ name: req.params.name })
        .then((newProject) => {
          if (newProject !== null) {
            res.status(203);
            ret = {
              error: {
                code: 203,
                message: 'Já existe um projeto com este nome.'
              }
            };
            res.send(ret);
          } else {
            const proj = new Project({
              name: req.params.name,
              createdBy: mongoose.mongo.ObjectId(req.params.createdBy)
            });
            try {
              proj.save();
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

module.exports = ProjectService;

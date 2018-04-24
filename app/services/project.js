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
    Project.find({}, (err, projects) => {
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
    Project.findOne({ name: req.params.project_name }, (err, project) => {
      if (err) {
        logger.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }

      res.send(project);
      next();
    });
  }

  /**
   * Method responsible for inserting a new Projects in the database
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static createNew (req, res, next) {
    // TODO
  }
}

module.exports = ProjectService;

const mongoose = require('mongoose');
const errors = require('restify-errors');
const logger = require('../common/logger');

const Project = mongoose.model('Project');

class ProjectService {
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

  static createNew (req, res, next) {
    // TODO
  }
}

module.exports = ProjectService;

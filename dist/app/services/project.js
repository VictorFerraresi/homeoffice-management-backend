"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const errors = require("restify-errors");
const error_response_1 = require("../error/error-response");
const logger_1 = require("../common/logger");
const project_1 = require("../models/project");
const user_1 = require("../models/user");
class ProjectService {
    /**
     * Method responsible for returning all the Projects in the database as a RESTful webservice
     * @param  {Object}   req  HTTP Request
     * @param  {Object}   res  HTTP Response
     * @param  {Function} next Next function to be called in the chain
     */
    static getAll(req, res, next) {
        project_1.Project.find({})
            .populate('createdBy')
            .exec((err, projects) => {
            if (err) {
                logger_1.logger.error(err);
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
    static find(req, res, next) {
        project_1.Project.findOne({ name: req.params.project_name })
            .populate('createdBy')
            .exec((err, project) => {
            if (err) {
                logger_1.logger.error(err);
                return next(new errors.InvalidContentError(err.errors.name.message));
            }
            if (project === null) {
                res.status(400);
                const ret = new error_response_1.ErrorResponse(400, 'Não existe nenhum projeto com este nome.');
                res.send(ret.error);
            }
            else {
                res.send(project);
                next();
            }
        });
    }
    /**
     * Method responsible for inserting a new Project in the database
     * @param  {Object}   req  HTTP Request
     * @param  {Object}   res  HTTP Response
     * @param  {Function} next Next function to be called in the chain
     */
    static createNew(req, res, next) {
        let ret;
        if (req.params.name === undefined || req.params.createdBy === undefined) {
            res.status(400);
            ret = new error_response_1.ErrorResponse(400, 'Payload de request inválido.');
            res.send(ret.error);
        }
        else {
            project_1.Project.findOne({ name: req.params.name })
                .then((newProject) => {
                if (newProject !== null) {
                    res.status(203);
                    ret = new error_response_1.ErrorResponse(203, 'Já existe um projeto com este nome.');
                    res.send(ret.error);
                }
                else {
                    const proj = new project_1.Project({
                        name: req.params.name,
                        createdBy: new Mongoose.mongo.ObjectId(req.params.createdBy)
                    });
                    try {
                        proj.save();
                        res.status(200);
                        res.send(ret);
                    }
                    catch (error) {
                        res.status(500);
                        ret = new error_response_1.ErrorResponse(500, 'Internal Server Error.');
                        res.send(ret.error);
                        throw error;
                    }
                }
            }).catch((error) => {
                res.status(500);
                ret = new error_response_1.ErrorResponse(500, 'Internal Server Error.');
                res.send(ret.error);
                throw error;
            });
        }
    }
    /**
     * Method responsible for adding a user into a Project
     * @param  {Object}   req  HTTP Request
     * @param  {Object}   res  HTTP Response
     * @param  {Function} next Next function to be called in the chain
     */
    static addMember(req, res, next) {
        let ret;
        if (req.params.project === undefined || req.params.username === undefined) {
            res.status(400);
            ret = new error_response_1.ErrorResponse(400, 'Payload de request inválido.');
            res.send(ret.error);
        }
        else {
            user_1.User.findOne({ username: req.params.username }, (err, user) => {
                if (err) {
                    logger_1.logger.error(err);
                    return next(new errors.InvalidContentError(err.errors.name.message));
                }
                if (user === null) {
                    res.status(400);
                    ret = new error_response_1.ErrorResponse(400, 'Este usuário não existe.');
                    res.send(ret.error);
                    next();
                }
                else {
                    project_1.Project.update({ _id: req.params.project }, { $addToSet: { members: user._id } }, (errB, num) => {
                        if (errB) {
                            logger_1.logger.error(errB);
                            return next(new errors.InvalidContentError(errB.errors.name.message));
                        }
                        if (num.nModified === 0) {
                            res.status(400);
                            ret = new error_response_1.ErrorResponse(400, 'Não foi encontrado um Projeto com este ID.');
                            res.send(ret.error);
                        }
                        else {
                            res.status(200);
                            res.send(ret);
                        }
                    });
                }
            });
        }
    }
    /**
     * Method responsible for removing a user from a Project
     * @param  {Object}   req  HTTP Request
     * @param  {Object}   res  HTTP Response
     * @param  {Function} next Next function to be called in the chain
     */
    static removeMember(req, res, next) {
        let ret;
        if (req.params.project === undefined || req.params.username === undefined) {
            res.status(400);
            ret = new error_response_1.ErrorResponse(400, 'Payload de request inválido.');
            res.send(ret.error);
        }
        else {
            user_1.User.findOne({ username: req.params.username }, (err, user) => {
                if (err) {
                    logger_1.logger.error(err);
                    return next(new errors.InvalidContentError(err.errors.name.message));
                }
                if (user === null) {
                    res.status(400);
                    ret = new error_response_1.ErrorResponse(400, 'Este usuário não existe.');
                    res.send(ret.error);
                    next();
                }
                else {
                    project_1.Project.update({ _id: req.params.project }, { $pull: { members: user._id } }, (errB, num) => {
                        if (errB) {
                            logger_1.logger.error(errB);
                            return next(new errors.InvalidContentError(errB.errors.name.message));
                        }
                        if (num.nModified === 0) {
                            res.status(400);
                            ret = new error_response_1.ErrorResponse(400, 'Não foi encontrado um projeto com este ID.');
                            res.send(ret.error);
                        }
                        else {
                            res.status(200);
                            res.send(ret);
                        }
                    });
                }
            });
        }
    }
}
exports.ProjectService = ProjectService;

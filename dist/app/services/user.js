"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors = require("restify-errors");
const error_response_1 = require("../error/error-response");
const logger_1 = require("../common/logger");
const config_1 = require("../common/config");
const bcrypt = require("bcrypt-node");
const jwt = require("jsonwebtoken");
const user_1 = require("../models/user");
class UserService {
    /**
     * Method responsible for returning all the Users in the database as a RESTful webservice
     * @param  {Object}   req  HTTP Request
     * @param  {Object}   res  HTTP Response
     * @param  {Function} next Next function to be called in the chain
     */
    static getAll(req, res, next) {
        user_1.user.find({}, (err, users) => {
            if (err) {
                logger_1.logger.error(err);
                return next(new errors.InvalidContentError(err.errors.name.message));
            }
            res.send(users);
            next();
        });
    }
    /**
     * Method responsible for returning a User by username from the database as a RESTful webservice
     * @param  {Object}   req  HTTP Request
     * @param  {Object}   res  HTTP Response
     * @param  {Function} next Next function to be called in the chain
     */
    static find(req, res, next) {
        user_1.user.findOne({ username: req.params.username }, (err, user) => {
            if (err) {
                logger_1.logger.error(err);
                return next(new errors.InvalidContentError(err.errors.name.message));
            }
            if (user === null) {
                res.status(400);
                const ret = new error_response_1.ErrorResponse(400, 'Não existe nenhum projeto com este nome.');
                res.send(ret.error);
            }
            else {
                res.send(user);
                next();
            }
        });
    }
    /**
     * Method responsible for validating an user password and authenticating it
     * @param  {Object}   req  HTTP Request
     * @param  {Object}   res  HTTP Response
     * @param  {Function} next Next function to be called in the chain
     */
    static validatePassword(req, res, next) {
        let ret;
        if (req.params.username === undefined || req.params.password === undefined) {
            res.status(400);
            ret = new error_response_1.ErrorResponse(400, 'Payload de request inválido.');
            res.send(ret.error);
        }
        else {
            user_1.user.findOne({ username: req.params.username }).then((newUser) => {
                if (newUser === null) {
                    res.status(203);
                    ret = new error_response_1.ErrorResponse(203, 'Este usuário não existe.');
                    res.send(ret.error);
                }
                else {
                    // hashed password from database
                    const hashedPassword = newUser.password;
                    try {
                        // comparing input password and fetched hashed password from db
                        bcrypt.compare(req.params.password, hashedPassword, (err, check) => {
                            if (check) {
                                // password OK
                                res.status(200);
                                const usr = {
                                    email: newUser.email,
                                    username: newUser.username,
                                    _id: newUser._id,
                                };
                                ret = {
                                    token: jwt.sign(usr, config_1.config.jwt.secret),
                                };
                                res.send(ret);
                            }
                            else {
                                // password NOK
                                res.status(203);
                                ret = new error_response_1.ErrorResponse(203, 'Senha incorreta.');
                                res.send(ret.error);
                            }
                        });
                    }
                    catch (exception) {
                        res.status(500);
                        res.send(ret);
                        throw exception;
                    }
                }
            }).catch((error) => {
                res.status(500);
                res.send(ret);
                throw error;
            });
        }
    }
    /**
     * Method responsible for registering a new user if it already not exists
     * @param  {Object}   req  HTTP Request
     * @param  {Object}   res  HTTP Response
     * @param  {Function} next Next function to be called in the chain
     */
    static tryRegister(req, res, next) {
        let ret;
        if (req.params.username === undefined || req.params.password === undefined ||
            req.params.email === undefined) {
            res.status(400);
            ret = new error_response_1.ErrorResponse(400, 'Payload de request inválido.');
            res.send(ret.error);
        }
        else {
            user_1.user.findOne({ $or: [{ username: req.params.username }, { email: req.params.email }] })
                .then((newUser) => {
                if (newUser !== null) {
                    if (newUser.username === req.params.username) {
                        res.status(203);
                        ret = new error_response_1.ErrorResponse(203, 'Já existe um usuário com este login.');
                        res.send(ret.error);
                    }
                    else {
                        res.status(203);
                        ret = new error_response_1.ErrorResponse(203, 'Já existe um usuário com este e-mail.');
                        res.send(ret.error);
                    }
                }
                else {
                    try {
                        bcrypt.hash(req.params.password, null, null, (err, hash) => {
                            const usr = new user_1.user({
                                username: req.params.username,
                                password: hash,
                                email: req.params.email,
                            });
                            try {
                                usr.save();
                                // user registered
                                res.status(200);
                                res.send(ret);
                            }
                            catch (error) {
                                res.status(500);
                                ret = new error_response_1.ErrorResponse(500, 'Internal Server Error.');
                                res.send(ret.error);
                                throw error;
                            }
                        });
                    }
                    catch (exception) {
                        res.status(500);
                        ret = new error_response_1.ErrorResponse(500, 'Internal Server Error.');
                        res.send(ret.error);
                        throw exception;
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
}
exports.UserService = UserService;

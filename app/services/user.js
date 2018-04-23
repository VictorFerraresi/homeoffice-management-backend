'use strict';

const mongoose = require('mongoose'),
      errors = require('restify-errors'),
      User = require('../models/user'),
      bcrypt = require('bcrypt-node'),
      jwt = require('jsonwebtoken'),
      config = require('../common/config');

var user = mongoose.model('User');

module.exports = {
  getAll: function(req, res, next) {
    user.find({}, function (err, users) {
      if (err) {
        console.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }

      res.send(users);
      next();
    });
  },

  find: function(req, res, next) {
    user.findOne({ username: req.params.username }, function(err, doc) {
      if (err) {
        console.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }

      res.send(doc);
      next();
    });
  },

  validatePassword: function(req, res, next) {
    var ret;

    if(req.params.username === undefined || req.params.password === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      user.findOne({ username: req.params.username }).then((new_user) => {
        if(new_user === null) {
          res.status(203);
          ret = {
            error: {
              code: 203,
              message: 'Este usuário não existe.'
            }
          };
          res.send(ret);
        } else {
        // hashed password from database
        var hashed_password = new_user.password;

        try {
            // comparing input password and fetched hashed password from db
            bcrypt.compare(req.params.password, hashed_password, function(err, check) {
              if(check) {
                    // password OK
                    res.status(200);
                    var user = {
                      email: new_user.email,
                      username: new_user.username,
                      _id: new_user._id
                    };

                    ret = {
                      token: jwt.sign(user, config.jwt.secret)
                    };

                    res.send(ret);
                  } else {
                    // password NOK
                    res.status(203);
                    ret = {
                      error: {
                        code: 203,
                        message: 'Senha incorreta.'
                      }
                    };
                    res.send(ret);
                  }
                });
          } catch (exception) {
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
  },

  tryRegister: function(req, res, next) {
    var ret;

    if(req.params.username === undefined || req.params.password === undefined || req.params.email === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      user.findOne({$or:[{ username: req.params.username }, {email: req.params.email}]}).then((new_user) => {
        if(new_user !== null) {
          if(new_user.username === req.params.username){
            res.status(203);
            ret = {
              error: {
                code: 203,
                message: 'Já existe um usuário com este login.'
              }
            };
            res.send(ret);
          } else {
            res.status(203);
            ret = {
              error: {
                code: 203,
                message: 'Já existe um usuário com este e-mail.'
              }
            };
            res.send(ret);
          }
        } else {
          try {
            bcrypt.hash(req.params.password, null, null, function(err, hash) {
              var user = new User({
                username: req.params.username,
                password: hash,
                email: req.params.email
              });

              try {
                user.save();

                    // user registered
                    res.status(200);
                    res.send(ret);

                  } catch(error) {
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
                });
          } catch (exception) {
            res.status(500);
            ret = {
              error: {
                code: 500,
                message: 'Internal Server Error'
              }
            };
            res.send(ret);
            throw exception;
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

};

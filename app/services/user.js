const mongoose = require('mongoose');
const errors = require('restify-errors');
const bcrypt = require('bcrypt-node');
const jwt = require('jsonwebtoken');
const config = require('../common/config');
const logger = require('../common/logger');

const User = mongoose.model('User');

module.exports = {
  getAll: (req, res, next) => {
    User.find({}, (err, users) => {
      if (err) {
        logger.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }

      res.send(users);
      next();
    });
  },

  find: (req, res, next) => {
    User.findOne({ username: req.params.username }, (err, doc) => {
      if (err) {
        logger.error(err);
        return next(new errors.InvalidContentError(err.errors.name.message));
      }

      res.send(doc);
      next();
    });
  },

  validatePassword: (req, res, next) => {
    let ret;

    if (req.params.username === undefined || req.params.password === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      User.findOne({ username: req.params.username }).then((newUser) => {
        if (newUser === null) {
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
                  _id: newUser._id
                };

                ret = {
                  token: jwt.sign(usr, config.jwt.secret)
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

  tryRegister: (req, res, next) => {
    let ret;

    if (req.params.username === undefined || req.params.password === undefined ||
    req.params.email === undefined) {
      res.status(400);
      ret = {
        error: {
          code: 400,
          message: 'Payload de request inválido.'
        }
      };
      res.send(ret);
    } else {
      User.findOne({ $or: [{ username: req.params.username }, { email: req.params.email }] })
        .then((newUser) => {
          if (newUser !== null) {
            if (newUser.username === req.params.username) {
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
              bcrypt.hash(req.params.password, null, null, (err, hash) => {
                const usr = new User({
                  username: req.params.username,
                  password: hash,
                  email: req.params.email
                });
                try {
                  usr.save();
                  // user registered
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

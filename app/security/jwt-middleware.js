'use strict';

const jsonwebtoken = require('jsonwebtoken');
const config = require('../common/config');

module.exports = {
  verifyToken: function(req, res, next) {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.jwt.secret, function(err, decode) {
        if(err) {
          req.user = undefined;
        }
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
  },
  requireToken: function(req, res, next) {
    if(req.user) {
      next();
    } else {
      res.status(401);
      var ret = {
        error: {
          code: 401,
          message: 'Usuário não autenticado (JWT).'
        }
      };
      return res.send(ret);
    }
  }
};

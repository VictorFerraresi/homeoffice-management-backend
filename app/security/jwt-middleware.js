const jsonwebtoken = require('jsonwebtoken');
const config = require('../common/config');

module.exports = {
  verifyToken: (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.jwt.secret, (err, decode) => {
        if (err) {
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
  requireToken: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401);
      const ret = {
        error: {
          code: 401,
          message: 'Usuário não autenticado (JWT).'
        }
      };
      return res.send(ret);
    }
  }
};

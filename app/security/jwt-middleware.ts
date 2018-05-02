import * as jsonwebtoken from 'jsonwebtoken';
import { ErrorResponse } from '../error/error-response';
import { config } from '../common/config';

export class JwtMiddleware {
  /**
   * Method responsible for verifying if a JWT token is valid
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static verifyToken (req, res, next) {
    if (req.headers && req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1],
                          config.jwt.secret, (err, decode) => {
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
  }

  /**
   * Method responsible for making sure that a JWT token is decoded and injected into the request
   * @param  {Object}   req  HTTP Request
   * @param  {Object}   res  HTTP Response
   * @param  {Function} next Next function to be called in the chain
   */
  static requireToken (req, res, next) {
    if (req.user) {
      next();
    } else {
      res.status(401);
      const ret = new ErrorResponse(401, 'Usuário não autenticado (JWT).');
      return res.send(ret.error);
    }
  }
}

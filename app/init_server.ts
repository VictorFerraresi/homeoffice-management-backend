import { config } from './common/config';
import * as restify from 'restify';
import * as Mongoose from 'mongoose';
import * as restifyPlugins from 'restify-plugins';
import { logger } from './common/logger';
import * as corsMiddleware from 'restify-cors-middleware';
import { JwtMiddleware } from './security/jwt-middleware';

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type'],
  exposeHeaders: ['API-Token-Expiry'],
});

const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const tasksRouter = require('./routes/task');

const server = restify.createServer({
  name: config.name,
  version: config.version,
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());
server.use(JwtMiddleware.verifyToken);

const prefix = `${config.prefix}/${config.api.version}`;

userRouter.applyRoutes(server, prefix);
projectRouter.applyRoutes(server, prefix);
tasksRouter.applyRoutes(server, prefix);

server.listen(config.port, () => {
  const db = Mongoose.connection;

  db.on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });

  db.once('open', () => {
    logger.info(`Restify is now listening on port ${config.port}!`);
  });
});

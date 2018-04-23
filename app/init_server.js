'use strict';

const config = require('./common/config'),
      restify = require('restify'),
      mongoose = require('mongoose'),
      restifyPlugins = require('restify-plugins'),
      logger = require('./common/logger'),
      corsMiddleware = require('restify-cors-middleware'),
      jwtMiddleware = require('./security/jwt-middleware');

const cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders: ['Access-Control-Allow-Origin','Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type'],
    exposeHeaders: ['API-Token-Expiry']
});

var userRouter = require('./routes/user');

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
server.use(jwtMiddleware.verifyToken);

var prefix = config.prefix + '/' + config.api.version;

userRouter.applyRoutes(server, prefix);


server.listen(config.port, () => {
    const db = mongoose.connection;

    db.on('error', (err) => {
        logger.error(err);
        process.exit(1);
    });

    db.once('open', () => {
        logger.info(`Restify is now listening on port ${config.port}!`);
    });
});

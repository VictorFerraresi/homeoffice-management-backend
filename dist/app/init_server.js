"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./common/config");
const restify = require("restify");
const Mongoose = require("mongoose");
const restifyPlugins = require("restify-plugins");
const logger_1 = require("./common/logger");
const corsMiddleware = require("restify-cors-middleware");
const jwt_middleware_1 = require("./security/jwt-middleware");
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
    name: config_1.config.name,
    version: config_1.config.version,
});
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());
server.use(jwt_middleware_1.JwtMiddleware.verifyToken);
const prefix = `${config_1.config.prefix}/${config_1.config.api.version}`;
userRouter.applyRoutes(server, prefix);
projectRouter.applyRoutes(server, prefix);
tasksRouter.applyRoutes(server, prefix);
server.listen(config_1.config.port, () => {
    const db = Mongoose.connection;
    db.on('error', (err) => {
        logger_1.logger.error(err);
        process.exit(1);
    });
    db.once('open', () => {
        logger_1.logger.info(`Restify is now listening on port ${config_1.config.port}!`);
    });
});

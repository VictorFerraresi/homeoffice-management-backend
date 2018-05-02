"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./app/common/logger");
logger_1.logger.info(`Nodejs version is ${process.version}`);
logger_1.logger.info('Loading /noderp-ws/ script. Howdy (´・ω・`)');
require('./app/load_db.js')
    .then(require('./app/load_models.js'))
    .then(require('./app/init_server.js'))
    .catch(err => logger_1.logger.error(`Exception thrown. ${err}`));

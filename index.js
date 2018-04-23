'use strict';

const logger = require('./app/common/logger'),
      config = require('./app/common/config');

logger.info(`Nodejs version is ${process.version}`);
logger.info('Loading /ho-backend/ script. Howdy (´・ω・`)');

require('./app/load_db.js')(config.db.uri)
  .then(require('./app/load_models.js'))
  .then(require('./app/init_server.js'))
  .catch((err) => logger.error(`Exception thrown. ${err}`));

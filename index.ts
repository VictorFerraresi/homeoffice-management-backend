import { config } from "./app/common/config";
import { logger } from "./app/common/logger";

logger.info(`Nodejs version is ${process.version}`);
logger.info('Loading /noderp-ws/ script. Howdy (´・ω・`)');

require('./app/load_db.js')
  .then(require('./app/load_models.js'))
  .then(require('./app/init_server.js'))
  .catch(err => logger.error(`Exception thrown. ${err}`));
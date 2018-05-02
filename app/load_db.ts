import * as mongoose from 'mongoose';
import { Admin } from 'mongodb';
import { logger } from './common/logger';
import { config } from './common/config';

(mongoose as any).Promise = global.Promise;

const options = {
  promiseLibrary: global.Promise,
};

export = new Promise((resolve, reject) => {
  mongoose.connect(config.db.uri, options)
    .then((handle) => {
      const admin = mongoose.connection.db.admin();
      admin.buildInfo((err, info) => {
        if (err) {
          logger.error(`Error getting MongoDB info: ${err}`);
          reject(err);
        } else {
          logger.info(`Connection to MongoDB (version ${info.version}) opened successfully!`);
          resolve(handle);
        }
      });
      return handle;
    })
    .catch((err) => {
      logger.error(`Error connecting to MongoDB: ${err}`);
      reject(err);
      throw err;
    });
});

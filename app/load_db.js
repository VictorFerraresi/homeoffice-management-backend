const mongoose = require('mongoose');
const logger = require('./common/logger');

mongoose.Promise = global.Promise;

const options = {
  promiseLibrary: global.Promise
};

function connect (URI) {
  return mongoose.connect(URI, options)
    .then((handle) => {
      const admin = new mongoose.mongo.Admin(mongoose.connection.db);
      admin.buildInfo((err, info) => {
        if (err) {
          logger.error(`Error getting MongoDB info: ${err}`);
        } else {
          logger.info(`Connection to MongoDB (version ${info.version}) opened successfully!`);
        }
      });
      return handle;
    })
    .catch((err) => {
      logger.error(`Error connecting to MongoDB: ${err}`);
      throw err;
    });
}

module.exports = connect;

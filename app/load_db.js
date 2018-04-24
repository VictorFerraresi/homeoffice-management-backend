const mongoose = require('mongoose');
const logger = require('./common/logger');

mongoose.Promise = global.Promise;

const options = {
  promiseLibrary: global.Promise
};

/**
 * Method responsible for returning a valid connection with the MongoDB
 * @param  {String}               URI The MongoDB complete connection URI
 * @return {ConnectionHandle}     A MongoDB Connection Handle
 */
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

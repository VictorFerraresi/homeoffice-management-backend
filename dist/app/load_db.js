"use strict";
const mongoose = require("mongoose");
const logger_1 = require("./common/logger");
const config_1 = require("./common/config");
mongoose.Promise = global.Promise;
const options = {
    promiseLibrary: global.Promise,
};
module.exports = new Promise((resolve, reject) => {
    mongoose.connect(config_1.config.db.uri, options)
        .then((handle) => {
        const admin = mongoose.connection.db.admin();
        admin.buildInfo((err, info) => {
            if (err) {
                logger_1.logger.error(`Error getting MongoDB info: ${err}`);
                reject(err);
            }
            else {
                logger_1.logger.info(`Connection to MongoDB (version ${info.version}) opened successfully!`);
                resolve(handle);
            }
        });
        return handle;
    })
        .catch((err) => {
        logger_1.logger.error(`Error connecting to MongoDB: ${err}`);
        reject(err);
        throw err;
    });
});

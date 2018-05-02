"use strict";
const path = require("path");
const fs = require("fs");
const logger_1 = require("./common/logger");
module.exports = new Promise(function (resolve, reject) {
    'use strict';
    const ModelsFolder = './models';
    var normalizedPath = path.join(__dirname, ModelsFolder);
    fs.readdirSync(normalizedPath).forEach(function (file) {
        try {
            if (file.endsWith('.js')) {
                var fileToRequire = path.join(normalizedPath, file);
                var model = require(fileToRequire);
                logger_1.logger.log('info', `Loaded model ${file} OK`);
                resolve(model);
            }
        }
        catch (ex) {
            logger_1.logger.error(ex);
            reject(ex);
        }
    });
});

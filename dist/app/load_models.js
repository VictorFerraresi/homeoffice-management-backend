"use strict";
const path = require("path");
const fs = require("fs");
const logger_1 = require("./common/logger");
module.exports = new Promise((resolve, reject) => {
    'use strict';
    const modelsFolder = './models';
    const normalizedPath = path.join(__dirname, modelsFolder);
    fs.readdirSync(normalizedPath).forEach((file) => {
        try {
            if (file.endsWith('.js')) {
                const fileToRequire = path.join(normalizedPath, file);
                const model = require(fileToRequire);
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

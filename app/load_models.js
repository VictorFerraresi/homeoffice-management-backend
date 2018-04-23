const path = require('path'),
      fs = require('fs'),
      logger = require('./common/logger');

module.exports = new Promise(function(resolve, reject) {
  'use strict';

  const ModelsFolder = 'models';
  var normalizedPath = path.join(__dirname, ModelsFolder);

  fs.readdirSync(normalizedPath).forEach(function(file) {
    try {
      if(file.endsWith('.js')) {
        var fileToRequire = path.join(normalizedPath, file);
        var model = require(fileToRequire)();

        logger.info(`Loaded model ${model.modelName} OK`);
        resolve(model);
      }
    } catch (ex) {
      logger.error(ex);
      reject(ex);
    }
  });
});

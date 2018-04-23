const path = require('path');
const fs = require('fs');
const logger = require('./common/logger');

module.exports = new Promise((resolve, reject) => {
  const ModelsFolder = 'models';
  const normalizedPath = path.join(__dirname, ModelsFolder);

  fs.readdirSync(normalizedPath).forEach((file) => {
    try {
      if (file.endsWith('.js')) {
        const fileToRequire = path.join(normalizedPath, file);
        const model = require(fileToRequire)();

        logger.info(`Loaded model ${model.modelName} OK`);
        resolve(model);
      }
    } catch (ex) {
      logger.error(ex);
      reject(ex);
    }
  });
});

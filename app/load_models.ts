import * as path from "path";
import * as fs from "fs";
import { logger } from "./common/logger";


export = new Promise(function(resolve, reject) {
  'use strict';

  const ModelsFolder = './models';
  var normalizedPath = path.join(__dirname, ModelsFolder);

  fs.readdirSync(normalizedPath).forEach(function(file) {
    try {
      if(file.endsWith('.js')) {
        var fileToRequire = path.join(normalizedPath, file);
        var model = require(fileToRequire);

        logger.log('info', `Loaded model ${file} OK`);
        resolve(model);
      }
    } catch (ex) {
      logger.error(ex);
      reject(ex);
    }
  });
});

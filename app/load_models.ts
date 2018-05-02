import * as path from 'path';
import * as fs from 'fs';
import { logger } from './common/logger';


export = new Promise((resolve, reject) => {
  'use strict';

  const modelsFolder = './models';
  const normalizedPath = path.join(__dirname, modelsFolder);

  fs.readdirSync(normalizedPath).forEach((file) => {
    try {
      if (file.endsWith('.js')) {
        const fileToRequire = path.join(normalizedPath, file);
        const model = require(fileToRequire);

        logger.log('info', `Loaded model ${file} OK`);
        resolve(model);
      }
    } catch (ex) {
      logger.error(ex);
      reject(ex);
    }
  });
});

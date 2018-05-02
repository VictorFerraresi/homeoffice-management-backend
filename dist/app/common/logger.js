"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const config_1 = require("./config");
const loggerLevel = config_1.config.logger.level;
exports.logger = new winston.Logger({
    level: loggerLevel,
    transports: [
        new winston.transports.File({
            filename: './logs/errors.log',
            level: 'error',
        }),
        new winston.transports.Console({ timestamp: true }),
    ],
});

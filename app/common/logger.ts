import * as winston from "winston";
import { config } from "./config";

const LoggerLevel = config.logger.level;

export const logger = new winston.Logger({
  level: LoggerLevel,
  transports: [
    new winston.transports.File({
      filename: './logs/errors.log',
      level: 'error'
    }),
    new winston.transports.Console({ 'timestamp': true })
  ]
});

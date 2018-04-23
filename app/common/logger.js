const winston = require('winston'),
      config = require('./config');

const LoggerLevel = config.logger.level;

module.exports = winston.createLogger({
  'level': LoggerLevel,
  'transports': [
    new winston.transports.Console({ 'timestamp': true })
  ],
  'format': winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  )
});

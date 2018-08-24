/**
 * Defines logger for the application.
 */
const bunyan = require('bunyan');

/**
 * Serializer function to for logging request objects
 * @param {HTTP Request} req - HTTP Request Object
 */
const reqSerializer = req => ({
  method: req.method,
  url: req.url,
  headers: req.headers,
});

// Creating logger for the application and configuring the log paths for different levels.
const logger = bunyan.createLogger({
  name: 'node-workshop',
  level: 'info',
  stream: process.stdout,
  serializers: {
    request: reqSerializer,
    err: bunyan.stdSerializers.err,
  },
});

// Disabling logger if it is test environment else adding streams.
if (process.env.NODE_ENV === 'test') {
  logger.level(bunyan.FATAL + 1);
}

module.exports = logger;

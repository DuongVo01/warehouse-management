const auth = require('./auth');
const role = require('./role');
const { validate, schemas } = require('./validator');
const { errorHandler, notFound } = require('./errorHandler');
const rateLimiter = require('./rateLimiter');
const requestLogger = require('./requestLogger');

module.exports = {
  auth,
  role,
  validate,
  schemas,
  errorHandler,
  notFound,
  rateLimiter,
  requestLogger
};
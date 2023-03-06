const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const utils = require('./utils/helpers');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.text({ type: 'text/plain', limit: '50mb' }));
app.use('/assets', express.static('public'));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

/**
 *
 * @param {httpStatus} code
 * @param {Boolean} status
 * @param {String} message
 * @param {Object} data
 */
app.response.sendJSONResponse = function ({ code, status = true, message, data, isShowMessage = true }) {
  // let exceptionError;
  // if ('exception' in data) {
  //   exceptionError = 'exception' in data ? data.exception : undefined;
  //   delete data.exception;
  // }

  utils.logResponse({ req: this.req, data, message, status, statusCode: code });
  return this.status(code).json({ code, status, message, isShowMessage, data });
};

module.exports = app;

'use strict';
const logger = require('../lib/winston');

const ErrorCode = {
  SERVER_ERROR: 'SERVER_ERROR',
  RIDES_NOT_FOUND_ERROR: 'RIDES_NOT_FOUND_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

const logError = (errorCode, message) => {
  logger.error(message);
  switch (errorCode) {
    case ErrorCode.SERVER_ERROR:
      return {
        error_code: errorCode,
        message: message || 'Unknown error'
      };
    case ErrorCode.RIDES_NOT_FOUND_ERROR:
      return {
        error_code: errorCode,
        message: message || 'Ride not found'
      };
    case ErrorCode.VALIDATION_ERROR:
      return {
        error_code: errorCode,
        message: message || 'Validation errorr'
      };
  }
};

module.exports = { logError, ErrorCode };

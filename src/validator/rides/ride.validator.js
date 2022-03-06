'use strict';
const { logError, ErrorCode } = require('../../../logs/errorHandler');

const validateParams = (page, perPage) => {
  if (page === undefined && perPage === undefined) {
    return false;
  }
  if (isNaN(Number(page)) || isNaN(Number(page))) {
    return logError(ErrorCode.VALIDATION_ERROR, 'Please enter page and perPage as integer');
  } else if (page < 1 || perPage < 1) {
    return logError(ErrorCode.VALIDATION_ERROR, 'page or perPage must be greater than 1');
  }
};

const validateBodyRideCreate = (body) => {
  const startLatitude = Number(body.start_lat);
  const startLongitude = Number(body.start_long);
  const endLatitude = Number(body.end_lat);
  const endLongitude = Number(body.end_long);
  const riderName = body.rider_name;
  const driverName = body.driver_name;
  const driverVehicle = body.driver_vehicle;

  if (isNaN(startLatitude) || isNaN(startLongitude) || isNaN(endLatitude) || isNaN(endLongitude)) {
    return logError(ErrorCode.VALIDATION_ERROR, 'startLatitude, startLongitude, endLatitude, endLongitude must be number');
  }

  if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
    return logError(ErrorCode.VALIDATION_ERROR, 'Start latitude and longitude must be between 90 - 90 and -180 to 180 degrees respectively');
  }

  if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
    return logError(ErrorCode.VALIDATION_ERROR, 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    return logError(ErrorCode.VALIDATION_ERROR, 'Rider name must be a non empty string');
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    return logError(ErrorCode.VALIDATION_ERROR, 'Driver name must be a non empty string');
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return logError(ErrorCode.VALIDATION_ERROR, 'Driver vehicle must be a non empty string');
  }
};

module.exports = {
  validateParams,
  validateBodyRideCreate
};

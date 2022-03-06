'use strict';

const { validateParams, validateBodyRideCreate } = require('../../validator/rides/ride.validator');
const logger = require('../../../lib/winston');
const { logError, ErrorCode } = require('../../../logs/errorHandler');

const getAllOfRides = async (req, res, db) => {

  const page = Number(req.query.page);
  const perPage = Number(req.query.perPage);

  try {
    const paramValidation = validateParams(page, perPage);

    if (paramValidation) {
      return res.status(400).send(pageValidator);
    }
    const rides = await new Promise((res, rej) => {

      db.all('SELECT * FROM Rides limit ? offset ?', [perPage, page], function (err, rows) {
        if (err) {
          rej(logError(ErrorCode.SERVER_ERROR, err));
        }
        logger.info(rows);
        res(rows);
      });

    });

    if (rides.length === 0) {
      return res.status(404).send(notFoundError());
    }
    res.status(200).send({ recordCount: rides.length, rides: rides });
  } catch (err) {
    res.status(500).send(err);
  }

};

const getRideDetailsById = async (req, res, db) => {

  try {
    const rides = await getRidesFromDbById(db, req.params.id);

    if (rides.length === 0) {
      return res.status(404).send(notFoundError());
    }
    return res.status(200).send(rides[0]);
  } catch (err) {
    return res.status(500).send(err);
  }

};

const getRidesFromDbById = async (db, id) => {
  return new Promise((res, rej) => {

    db.all('SELECT * FROM Rides WHERE rideID= ?', [id], function (err, rows) {
      if (err) {
        rej(logError(ErrorCode.SERVER_ERROR, err));
      }
      logger.info(rows);
      res(rows);
    });

  });
};

const createRide = async (req, res, db) => {
  const validationBodyRide = validateBodyRideCreate(req.body);

  if (validationBodyRide) {
    return res.status(400).send(validationBodyRide);
  }

  try {
    const rideIdSaved = await new Promise((res, rej) => {
      const values = [body.start_lat, body.start_long, body.end_lat, body.end_long, body.rider_name, body.driver_name, body.driver_vehicle];

      db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
        if (err) {
          logger.error('Unknown error');
          rej(logError(ErrorCode.SERVER_ERROR, err));
        }
        res(this.lastID);
      });
    });
    const ride = await getRidesFromDbById(db, rideIdSaved);

    return res.status(201).send(ride[0]);
  } catch (err) {
    return res.status(500).send(err);
  }

};

module.exports = {
  getAllOfRides,
  getRideDetailsById,
  createRide,
};

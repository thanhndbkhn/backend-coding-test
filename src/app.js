'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { createRide, getAllOfRides, getRideDetailsById } = require('./controllers/rides/ride.controller');

module.exports = (db) => {
  app.get('/health', (req, res) => {
    res.send('Healthy');
  });

  app.post('/rides', jsonParser, (req, res) => {
    createRide(req, res, db);
  });

  app.get('/rides', (req, res) => {
    getAllOfRides(req, res, db);
  });

  app.get('/rides/:id', (req, res) => {
    getRideDetailsById(req, res, db);
  });

  return app;
};

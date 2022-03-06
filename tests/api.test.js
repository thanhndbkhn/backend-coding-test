'use strict';

const request = require('supertest');
const expect = require('chai').expect;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('GET rides', () => {
    it('should return error empty data', (done) => {
      request(app)
        .get('/rides')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          if (err) {
            console.log(err);
            return done(err);
          }
          done();
        });
    });

    it('should return error parameter page, perPage greater than 1', (done) => {
      request(app)
        .get('/rides?page=0&perPage=0')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should return error parameter page, perPage isNaN', (done) => {
      request(app)
        .get('/rides?page=a&perPage=b')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should can\'t get ride details', (done) => {
      request(app)
        .get('/rides/1')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          console.log(err);
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should return totalCount', (done) => {
      const stringData = '(\'60\', \'120\', \'60\', \'120\', \'riderName\', \'driverName\', \'driverVehicle\')';

      db.run(`INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES ${stringData}`, function (err) {
        request(app)
          .get('/rides?page=1&perPage=1')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.body.totalCount).equal(1);
            done();
          });
      });
    });

    it('should get ride details ', (done) => {
      request(app)
        .get('/rides/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          console.log('Gonzalo', res.body);
          expect(res.body.riderName).to.equals('riderName');
          done();
        });

    });
  });

  describe('POST /rides', () => {
    it('should validate startLatitude or startLongitude is NaN error', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 'stringNaN',
          start_long: '',
          end_lat: '',
          end_long: '',
          rider_name: 'riderName',
          driver_name: 'driverName',
          driver_vehicle: 'driverVehicle'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('POST /rides', () => {
    it('should validate startLatitude or startLongitude is error', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 91,
          start_long: 190,
          end_lat: 60,
          end_long: 120,
          rider_name: 'riderName',
          driver_name: 'driverName',
          driver_vehicle: 'driverVehicle'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('POST /rides', () => {
    it('should validate endLatitude or endLongitude is error', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 60,
          start_long: 120,
          end_lat: 190,
          end_long: 190,
          rider_name: 'riderName',
          driver_name: 'driverName',
          driver_vehicle: 'driverVehicle'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('POST /rides', () => {
    it('should validate ride name is error', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 60,
          start_long: 120,
          end_lat: 60,
          end_long: 120,
          rider_name: '',
          driver_name: 'driverName',
          driver_vehicle: 'driverVehicle'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('POST /rides', () => {
    it('should validate driver name is error', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 60,
          start_long: 120,
          end_lat: 60,
          end_long: 120,
          rider_name: 'riderName',
          driver_name: '',
          driver_vehicle: 'driverVehicle'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('POST /rides', () => {
    it('should validate driver vehicle is error', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 60,
          start_long: 120,
          end_lat: 60,
          end_long: 120,
          rider_name: 'riderName',
          driver_name: 'driverName',
          driver_vehicle: ''
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('POST /rides', () => {
    it('should create ride', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 60,
          start_long: 120,
          end_lat: 60,
          end_long: 120,
          rider_name: 'riderName',
          driver_name: 'driverName',
          driver_vehicle: 'driverVehicle'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});

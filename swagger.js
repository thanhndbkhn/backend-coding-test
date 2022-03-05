'use strict';

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];
console.log(endpointsFiles)

swaggerAutogen(outputFile, endpointsFiles);

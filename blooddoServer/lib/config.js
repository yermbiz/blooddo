'use strict';
const path = require('path');

module.exports = {
  database: process.env.MONGO_URI || 'mongodb://127.0.0.1/blooddo',
  client_path: process.env.CLIENT_PATH_DIST || '../../blooddoClient/dist'
};

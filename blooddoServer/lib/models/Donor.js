'use strict';

const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  address: { type: String, required: true },
  ip: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true }
});

mongoose.Promise = global.Promise;
module.exports = mongoose.model('Donor', donorSchema);

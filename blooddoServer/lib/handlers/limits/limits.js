'use strict';

const Joi = require('joi');

module.exports = {
  firstName: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]+$/),
  lastName: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]+$/),
  contactNumber: Joi.string().regex(/^(?:\b|[+])[0-9]*(?:\b|[_\s])[0-9]*(?:\b|[_\s])[0-9]*(?:\b|[_\s])[0-9]*$/),
  email: Joi.string().email(),
  bloodGroup: Joi.string().valid(
    'O+',
    'O-',
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-'
  ),
  lat: Joi.number(),
  lon: Joi.number(),
  address: Joi.string().max(500),
  ip: Joi.string().ip(),
  x: Joi.number(),
  y: Joi.number(),
  xmin: Joi.number(),
  ymin: Joi.number(),
  xmax: Joi.number(),
  ymax: Joi.number()
};

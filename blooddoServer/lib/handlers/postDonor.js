'use strict';

const Joi = require('joi');
const crypto = require('crypto');
const limits = require('./limits/limits');

const reqValidationSchema = Joi.object().keys({
  firstName: limits.firstName.required(),
  lastName: limits.lastName.required(),
  contactNumber: limits.contactNumber.required(),
  email: limits.email.required(),
  bloodGroup: limits.bloodGroup.required(),
  lat: limits.lat.required(),
  lon: limits.lon.required(),
  address: limits.address.required(),
  ip: limits.ip.required(),
  x:  limits.x.required(),
  y:  limits.y.required()
}).required();

/**
 * POST /api/donor
 * Saves new donor
 */
module.exports = (model) => {
  return (req, res) => {
    const body = req.body;

    Joi.validate(body, reqValidationSchema, (err) => {
      if (err) {
        return res.status(400).send();
      }
      return saveData(body);
    });

    function saveData(data) {
      const donor = new model(data);

      donor.save((err, doc) => {
        if (err) return res.status(500).send();
        process.emit('data-changed', null);
        return res.status(201).send({link: doc._id});
      });
    }
  };
};

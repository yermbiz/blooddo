'use strict';

const Joi = require('joi');
const crypto = require('crypto');
const limits = require('./limits/limits');

const reqValidationSchema = Joi.object().keys({
  firstName: limits.firstName.required(),
  lastName: limits.lastName.required(),
  contactNumber: limits.contactNumber.required(),
  email: limits.email.required(),
  bloodGroup: limits.bloodGroup.required()
}).required();

/**
 * PUT /api/donor
 * Updates donor
 */
module.exports = (model) => {
  return (req, res) => {
    const body = req.body;

    Joi.validate(body, reqValidationSchema, (err) => {
      if (err) {
        return res.status(400).send();
      }
      return updateData(body);
    });

    function updateData(data) {
      model.findById(req.params.link, (err, donor) => {
        if (err) return res.status(500).send();
        if (!donor) return res.status(404).send();
        donor.firstName = req.body.firstName || donor.firstName;
        donor.lastName = req.body.lastName || donor.lastName;
        donor.contactNumber = req.body.contactNumber || donor.contactNumber;
        donor.email = req.body.email || donor.email;
        donor.bloodGroup = req.body.bloodGroup || donor.bloodGroup;

        donor.save(function (err, updatedDonor) {
              if (err) return res.status(500).send();
              process.emit('data-changed', null);
              res.status(200).send(updatedDonor);
          });
      });
    }
  };
};

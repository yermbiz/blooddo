'use strict';

const Joi = require('joi');
const limits = require('./limits/limits');
const reqValidationSchema = Joi.object().keys({}).required();

const generateLink = () => {
  const phrase = 'link'+Date.now();
  return crypto.createHash('md5').update(phrase).digest('hex');
};
/**
 * DELETE /api/donor
 * Deletes donor
 */
module.exports = (model) => {

  return (req, res) => {
    const body = req.body;

    Joi.validate(body, reqValidationSchema, (err) => {
      if (err || !req.params.link) {
        return res.status(400).send();
      }
      return deleteData();
    });

    function deleteData() {
      model.findByIdAndRemove(req.params.link, (err, doc) => {
        if (err) return res.status(500).send();
        process.emit('data-changed', null);
        return res.status(200).send({});
      });
    }
  };
};

'use strict';

const Joi = require('joi');
const url = require('url');
const limits = require('./limits/limits');

const reqValidationSchema = Joi.object().keys({}).required();

/**
 * GET /api/donor/:link
 * Gets donor's data
 */
module.exports = (model) => {
  return (req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    if (!req.params.link) return res.status(400).send();
    Joi.validate(query, reqValidationSchema, (err) => {
      if (err) return res.status(400).send();
      return reqDataOk();
    });

    function reqDataOk() {
      model.findById(req.params.link, (err, doc) => {
        if (err) return res.status(500).send();
        if (!doc) return res.status(404).send();
        res.status(200).send(doc);
      });
    }

  };
}

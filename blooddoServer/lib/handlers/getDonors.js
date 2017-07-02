'use strict';

const Joi = require('joi');
const url = require('url');
const limits = require('./limits/limits');

const reqValidationSchema = Joi.object().keys({
  xmin:  limits.xmin.required(),
  xmax:  limits.xmax.required(),
  ymin:  limits.ymin.required(),
  ymax:  limits.ymax.required()

}).required();

/**
 * GET /api/donors
 * Gets donors
 */
module.exports = (model) => {
  return (req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;

    Joi.validate(query, reqValidationSchema, (err) => {
      if (err) return res.status(400).send();
      return reqDataOk();
    });

    function reqDataOk() {
      model.find({x: { $gt: query.xmin, $lt: query.xmax }, y: { $gt: query.ymin, $lt: query.ymax }}, (err, docs) => {
        if (err) return res.status(500).send();
        res.status(200).send(docs);
      });
    }
  };
};

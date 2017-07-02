const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/activate');

const Donor = mongoose.model('Donor');

const postDonor = require('../handlers/postDonor')(Donor);
const getDonor = require('../handlers/getDonor')(Donor);
const deleteDonor = require('../handlers/deleteDonor')(Donor);
const updateDonor = require('../handlers/updateDonor')(Donor);
const getDonors = require('../handlers/getDonors')(Donor);

router.post('/donor', postDonor);
router.get('/donor/:link', getDonor);
router.put('/donor/:link', updateDonor);
router.delete('/donor/:link', deleteDonor);
router.get('/donors', getDonors);

module.exports = router;

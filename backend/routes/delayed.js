const express = require('express');

const router = express.Router();

const delayed = require('../models/delayed');

router.get('/', (req, res, next) => delayed.getDelayedTrains(req, res, next));

module.exports = router;

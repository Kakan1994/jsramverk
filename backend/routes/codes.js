// backend/routes/codes.js
const express = require('express');

const router = express.Router();

const codes = require('../models/codes');

router.get('/', (req, res, next) => codes.getCodes(req, res, next));

module.exports = router;

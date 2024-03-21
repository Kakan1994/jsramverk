// backend/routes/tickets.js
const express = require('express');

const router = express.Router();

const tickets = require('../models/tickets');

router.get('/', (req, res, next) => tickets.getTickets(req, res, next));

router.post('/', (req, res, next) => tickets.createTicket(req, res, next));

module.exports = router;

const express = require("express");
const { createGuests, findGuests } = require("../../controllers/guests/guests");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/guests', middlewareToken, createGuests);

module.exports = router;
const express = require("express");
const { createDetailLocation } = require("../../../controllers/weddings/detail_location/detail_location");
const middlewareToken = require("../../../middleware/jwtToken");
const router = express.Router();

router.post('/detail-location', middlewareToken, createDetailLocation);

module.exports = router;
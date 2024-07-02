const express = require("express");
const { findReservation, updateReservation } = require("../../controllers/reservations/reservations");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.get('/reservation', middlewareToken, findReservation);
router.put('/update-reservation', middlewareToken, updateReservation);

module.exports = router;
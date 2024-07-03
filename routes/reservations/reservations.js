const express = require("express");
const { updateReservation } = require("../../controllers/reservations/reservations");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.put('/update-reservation', middlewareToken, updateReservation);

module.exports = router;
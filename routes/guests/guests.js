const express = require("express");
const { createGuests, findGuests, findGuestById, updateGuest, deleteGuests } = require("../../controllers/guests/guests");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/guests', middlewareToken, createGuests);
router.get('/guests', middlewareToken, findGuests);
router.get('/guest', middlewareToken, findGuestById);
router.patch('/guests/:id', middlewareToken, updateGuest);
router.delete('/guests/:id', middlewareToken, deleteGuests);

module.exports = router;
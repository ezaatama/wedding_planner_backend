const express = require("express");
const { createMessages } = require("../../controllers/messages/messages");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/messages', middlewareToken, createMessages);

module.exports = router;
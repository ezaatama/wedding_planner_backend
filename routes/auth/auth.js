const express = require("express");
const { login } = require("../../controllers/auth/auth");
// const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/login', login);

module.exports = router;
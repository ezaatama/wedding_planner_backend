const express = require("express");
const { login, me, changePass, logout } = require("../../controllers/auth/auth");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/login', login);
router.get('/me', middlewareToken, me);
router.post('/change-pass', middlewareToken, changePass);
router.post('/logout', middlewareToken, logout);

module.exports = router;
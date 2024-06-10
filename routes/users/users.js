const express = require("express");
const { createUser, findAllUser } = require("../../controllers/users/users");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/users', createUser);
router.get('/users', middlewareToken, findAllUser);

module.exports = router;
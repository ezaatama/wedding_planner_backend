const express = require("express");
const { createUser, findAllUser, findUserById, updateUser, deleteUser } = require("../../controllers/users/users");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/users', createUser);
router.get('/users', middlewareToken, findAllUser);
router.get('/users/:uuid', middlewareToken, findUserById);
router.patch('/users/:uuid', middlewareToken, updateUser);
router.delete('/users/:uuid', middlewareToken, deleteUser);

module.exports = router;
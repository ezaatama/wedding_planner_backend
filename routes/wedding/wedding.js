const express = require("express");
const { createWeddings, findWedding, findWeddingById } = require("../../controllers/weddings/wedding");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/weddings', middlewareToken, createWeddings);
router.get('/weddings', middlewareToken, findWedding);
router.get('/weddings/:id', middlewareToken, findWeddingById);

module.exports = router;
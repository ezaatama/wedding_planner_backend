const express = require("express");
const { createWeddings, findWedding, findWeddingById, updateWedding, deleteWedding } = require("../../controllers/weddings/wedding");
const middlewareToken = require("../../middleware/jwtToken");
const router = express.Router();

router.post('/weddings', middlewareToken, createWeddings);
router.get('/weddings', middlewareToken, findWedding);
router.get('/weddings/:uuid', middlewareToken, findWeddingById);
router.patch('/weddings/:uuid', middlewareToken, updateWedding);
router.delete('/weddings/:uuid', middlewareToken, deleteWedding);

module.exports = router;
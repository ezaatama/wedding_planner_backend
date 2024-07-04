const express = require("express");
const { createDetailBride } = require("../../../controllers/weddings/detail_bride/detail_bride");
const middlewareToken = require("../../../middleware/jwtToken");
const router = express.Router();

router.post('/detail-bride', middlewareToken, createDetailBride);

module.exports = router;
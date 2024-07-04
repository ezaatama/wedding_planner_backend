const express = require("express");
const { createWeddingImage } = require("../../../controllers/weddings/images/wedding_image");
const middlewareToken = require("../../../middleware/jwtToken");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpeg" ||
          file.mimetype === "image/jpg"
        ) {
          cb(null, path.join(__dirname,"../../../public/assets/images/"));
        }
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
});

const filter = (req, file, cb) => {
    if(file.fieldname === 'image_url') {
        (file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg") ? cb(null, true) : cb(null, false);
      }
}

const uploadArrayFile = multer({
    storage: storage,
    fileFilter: filter,
  }).array("image_url", 5);

router.post('/wedding-image', middlewareToken, uploadArrayFile, createWeddingImage);

module.exports = router;
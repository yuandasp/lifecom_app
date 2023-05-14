const express = require("express");
const router = express.Router();
const { profileController } = require("../controllers");
const { verifyToken } = require("../middleware/authVerification");
const upload = require("../middleware/multer");

router.get("/", verifyToken, profileController.getDataUser);
router.patch("/", verifyToken, profileController.editDataUser);
router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  profileController.uploadProfilePicture
);

module.exports = router;

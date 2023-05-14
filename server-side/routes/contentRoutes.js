const express = require("express");
const router = express.Router();
const { contentController } = require("../controllers");
const {
  verifyToken,
  verifyContent,
} = require("../middleware/authVerification");
const upload = require("../middleware/multer");

router.post(
  "/",
  verifyToken,
  upload.single("file"),
  contentController.createContent
);
router.patch("/:id", verifyToken, verifyContent, contentController.editContent);
router.delete(
  "/:id",
  verifyToken,
  verifyContent,
  contentController.deleteContent
);
router.get("/", verifyToken, contentController.getAllContent);
router.get("/:uuid", verifyToken, contentController.getContentDetail);
router.post("/:id/likes", verifyToken, contentController.likesFeature);
router.get("/:id/likes", verifyToken, contentController.getLikes);

module.exports = router;

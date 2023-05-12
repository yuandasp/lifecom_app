const express = require("express");
const router = express.Router();
const { contentController } = require("../controllers");
const { verifyToken } = require("../middleware/authVerification");

router.post("/", verifyToken, contentController.createContent);
router.delete("/:id", verifyToken, contentController.deleteContent);
router.patch("/:id", verifyToken, contentController.editContent);
router.get("/", contentController.getAllContent);
router.get("/:id", verifyToken, contentController.getContentDetail);

module.exports = router;

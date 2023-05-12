const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { verifyToken } = require("../middleware/authVerification");

router.get("/:id", verifyToken, userController.getDataUser);
router.patch("/:id", verifyToken, userController.editDataUser);

module.exports = router;

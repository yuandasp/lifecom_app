const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { verifyToken } = require("../middleware/authVerification");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verification", verifyToken, authController.verification);
router.post("/resend-verification", verifyToken, authController.verification);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  sendOTP,
  signUP,
  login,
  changePassword,
  // logout
} = require("../controllers/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

// *******  Routes for login, signup and authentication *******

router.post("/login", login);
router.post("/signup", signUP);
router.post("/sendotp", sendOTP);
router.post("/changePassword", auth, changePassword);
// router.post("/logout",logout); 

// ****** RESET PASSWORD *******

// Route for generating a reset password Token
router.post("/reset-password-token", resetPasswordToken);

// Route for reset User's Password token
router.post("/reset-password", resetPassword);

// Export router
module.exports = router;

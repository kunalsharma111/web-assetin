// Import the Require Module
const express = require("express");
const router = express.Router();

const { capturePayment, verifySignature } = require("../controllers/Payments");
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);  // test this api at last

module.exports = router;

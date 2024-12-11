const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

const {
  deleteAccount,
  updateProfile,
  getUserDetails,
  getEnrolledCourses,
  updateDisplayPicture,
} = require("../controllers/Profile");

// Profiles Routes

// delete User Account
router.delete("/deleteProfile", auth,deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);


// Get Enrolled Courses
router.get("/getUserDetails", auth, getUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);


module.exports = router;

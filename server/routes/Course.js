// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers

// Course Controllers Import

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

// Category Controllers Import
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// SubSections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

// Importing Middlewares
const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/auth");

// Category routes *** Admin *** 
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.get("/categoryPageDetails", categoryPageDetails);


// Courses can Only be Created by Instructors

router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/getAllCourses", auth, getAllCourses);
router.post("/getCourseDetails", auth, getCourseDetails);

// Section Routes
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);


// SubSection Routes
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);


// **************  Rating and Reviews ************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRating", getAllRating);

module.exports = router;

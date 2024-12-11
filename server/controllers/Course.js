const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");

// create Course Handler function
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag,
    } = req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category ||
      !thumbnail
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all the required Fields" });
    }

    // validate price
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price should be a positive number",
      });
    }

    // convert String to ObjectId
    const categoryObjectId = new mongoose.Types.ObjectId(category);

    // check courseCategory is available or not
    const categoryCheck = await Category.findById(categoryObjectId);
    if (!categoryCheck) {
      return res.status(404).json({
        success: false,
        message: "CourseCategory not found, select another course to create",
      });
    }

    // check the Instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    // Upload Image to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry in DATABASE for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryObjectId,
      tag,
      thumbnail: thumbnailImage.secure_url,
    });

    // add the new course to the user schema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );

    // update the category with the new course
    await Category.findByIdAndUpdate(
      categoryObjectId,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error); // log the error for debugging
    return res.status(500).json({
      success: false,
      message: "Failed to create Course",
      error: error.message,
    });
  }
};


// get All Courses handler function

exports.getAllCourses = async (req, res) => {
  // TODO: change the below statement incrementally
  try {
    const allCourses = await Course.find({}, {}).populate({
      path: "instructor",
    });

    return res.status(200).json({
      success: true,
      message: "Your all Courses",
      allCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Can't Fetch All Courses Data",
      error: error.message,
    });
  }
};

// get CourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    // get id
    const { courseId } = req.body;

    // find course Details

    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "coursContent",
        populate: {
          path: "subSection",
        },
      });

    // validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Course Details fetched Successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

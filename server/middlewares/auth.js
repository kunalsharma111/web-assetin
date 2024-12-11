const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/User");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    // if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // verify the token

    try {
      // Validate token with your logic (e.g., check database)
      // const user = await User.findOne({ token: token });
      // if (!user) {
      //   return res.status(401).json({
      //     success: false,
      //     message: "Invalid token" });
      // }
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log("your decode auth is : ",decode);
      // data ko req.user me store kar lege
      req.user = decode;

      // checking for user exist or not
      const userDetails = await User.findById(req.user.id);
      if (!userDetails) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      console.log("req.user is : ", req.user);
      console.log("auth middleware successful");
    } catch (error) {
      // verification -- issue
      console.log("*** Error *** : ", error);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next(); // for next funtion call
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Student only",
      });
    }
    console.log("Student check Successfull"); 
    next();
  } catch (error) {
    console.log("isStudent Problem: ", error);

    return res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again",
    });
  }
};

// isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructor only",
      });
    }
    console.log("Instructor check Successfull"); 
    next();
  } catch (error) {
    console.log("Instructor Problem: ", error);

    return res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again",
    });
  }
};

// isAdmin

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    console.log("Admin check Successfull"); 
    next();
  } catch (error) {
    console.log("isAdmin Problem: ", error);

    return res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again",
    });
  }
};

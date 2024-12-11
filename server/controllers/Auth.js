const bcrypt = require("bcrypt");

const User = require("../models/User");
const OTP = require("../models/OTP");

const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

//sendOTP

exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request ki body

    const { email } = req.body;

    // check if user already exist

    const checkUserPresent = await User.findOne({ email });

    // if user already exist , then return a response

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered",
      });
    }

    // generate OTP

    var otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP generated: ", otp);

    // check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        uppperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an entry for OTP
    const otpBody = await OTP.create(otpPayload);

    console.log("Your otpBody is : ", otpBody);

    // return response successful
    res.status(200).json({
      success: true,
      message: "OTP sent Successfully",
      otp,
    });
  } catch (error) {
    console.log("Your OTP error: ", error);
    return res.status(500).json({
      success: false,
      message: "OTP couldn't sent",
    });
  }
};

// signUP

exports.signUP = async (req, res) => {
  try {
    // data fetch from request ki body

    const {
      firstName,
      lastName,
      password,
      confirmPassword,
      email,
      accountType,
      otp,
    } = req.body;

    console;
    // validate krlo
    if (!firstName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required. Please fill all fields",
      });
    }

    // 2 password match krlo

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and ConfirmPassword does not match, please try again",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already Registered",
      });
    }

    // find most recent OTP stored for the user
    const recentOTP = await OTP.find({
      email: new RegExp("^" + email + "$", "i"),
    })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log("Recent OTP from database: ", recentOTP);

    // otp --> user ne jo otp write kiya hai
    // recentOTP --> server ne jo otp database me store kiya hai

    // validate OTP
    if (recentOTP.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found in Database", // sahi message
      });
    } else if (otp !== recentOTP[0].otp) {
      // recentOTP ko index se access karein
      return res.status(400).json({
        success: false,
        message: "OTP doesn't match",
      });
    }

    // Hash Password
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;

    // entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateofBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,

      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return res
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
    });
  } catch (error) {
    console.log("**** Your error to Signup : ", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

// Login

exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;

    // validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, Please fill require field",
      });
    }
    // user check exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please Signup first",
      });
    }
    // generate JWT, after password matching

    // await bcrypt.compare(password, user.password)
    if (password == user.password) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.password = password;
      await user.save();
      user.token = token;
      console.log("token is : ", token);

      // create cookie and send response

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged In Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  } catch (error) {
    console.log("Login error : ", ErrorEvent);
    return res.status(500).json({
      success: false,
      message: "Login Failure, Please try again",
    });
  }
};

// logout

exports.logout = async (req, res) => {};

//ChangePassword
exports.changePassword = async (req, res) => {
  try {
    // Get data from req body
    const {
      oldPassword,
      newPassword,
      confirmPassword = newPassword,
    } = req.body;

    // Validation
    if (!oldPassword || !newPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm Password do not match",
      });
    }

    // Find user by id or token, verify old password
    const user = await User.findById(req.user.id);
    console.log("User fetched from DB: ", user);
    // const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (oldPassword !== user.password) {
      return res.status(401).json({
        success: false,
        message: "Old Password is incorrect",
      });
    }

    // Update password in DB
    // user.password = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    await user
      .save()
      .then(() => {
        console.log("Password updated successfully in DB");
      })
      .catch((err) => {
        console.log("Error saving updated password:", err);
      });

    console.log("after update pass user : ", user);
    // Send mail
    await mailSender(
      user.email,
      "Password Updated",
      `Your password has been updated successfully. Your new password is: ${newPassword}`
    );
    // Return response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

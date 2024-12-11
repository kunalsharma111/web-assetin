const User = require("../models/User");
const mailSender = require("../utils/mailSender");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;

    // check user for this email, email validation
    const user = await User.findOne({ email: email });
    // console.log("user email is : ", user);

    if (!user) {
      return res.json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }

    // generate  Token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // console.log("updated user : ", updatedDetails);

    // create url

    const base_url = process.env.BASE_URL || "http://localhost:3000"; // This will dynamically take the base URL
    console.log("base url is : ", base_url);
    const url = `${base_url}/update-password/${user._id}/${token}`;

    // send mail containing the url

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    // return response
    return res.json({
      success: true,
      message:
        "Email sent successfully, please check Email and change password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// resetPassword

exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token, _id } = req.body;

    console.log({
      password: password,
      "confirm pass": confirmPassword,
      _id: _id,
      token: token,
    });

    // console.log("***user***", req.user);
    // const userid = req.user.id;

    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }

    // get userdetails from db using token

    // console.log("*** Your Id *** : ", id);
    const userDetails = await User.findOne({ _id: _id, token: token });

    // console.log("token basis user find : ", userDetails);
    // if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }

    // token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, Please regenerate your token",
      });
    }

    // hash pwd
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;

    // password update

    const newUser = await User.findOneAndUpdate(
      { _id: userDetails._id, token: token },
      {
        password: hashedPassword,
        token: null, // Reset token after password update
        resetPasswordExpires: null, // Also reset the expiry time
      },
      { new: true }
    );

    // console.log("newUser is : ", newUser);
    // return response

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("resetPassword Error: ", error);

    return res.status(500).json({
      success: false,
      message: "There was an issue with Reset Password",
    });
  }
};

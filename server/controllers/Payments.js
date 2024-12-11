const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  // get courseID and UserID
  const { course_id } = req.body;
  const userId = req.user.id;

  // Validation

  // Valid CourseID
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please Provide Valid Course ID",
    });
  }

  // valid CourseDetails
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the Course",
      });
    }

    // user already pay for the same course
    const uid = new mongoose.Types.ObjectId(userId);

    if (course.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // order create
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount ,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    // initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log("paymentResponse : ",paymentResponse);

    // return response

    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Could nto initiate order",
    });
  }
};

// verify Signature of Razorpay and Server

exports.verifySignature = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  const webhookSecret = "12345678";

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is Authorised");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // fulfil the action

      // find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not Found",
        });
      }
      console.log(enrolledCourse);

      // find the student and add the course to their list enrolled courses me
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );

      console.log(enrolledStudent);

      // mail send krdo confirmation wala mail
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations from Eduspark platform",
        "Congratulations, you are onboarded into new  Eduspark  Course"
      );

      console.log(emailResponse);

      // return response
      return res.status(200).json({
        success: true,
        message: "Signature Verified and Course Added",
      });
    } catch (error) {
      console.log("Error in Enrollment", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Could not find the Course",
    });
  }
};

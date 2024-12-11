require("dotenv").config();
const nodemailer = require("nodemailer");

exports.contact = async (req, res) => {
  const { firstname, lastname, email, message, phoneNo, countrycode } =
    req.body;

    // console.log("email is : ",email); 
  // Prepare the email content
  const title = "New Contact Form Submission";
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 5px;">
      <h1 style="color: #333;">Contact Form Submission</h1>
      <p style="font-size: 16px; color: #555;">You have received a new contact form submission.</p>
      
      <h2 style="color: #333;">Details:</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <th style="text-align: left; padding: 8px; background-color: #007bff; color: white;">Field</th>
          <th style="text-align: left; padding: 8px; background-color: #007bff; color: white;">Information</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">First Name</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${firstname}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Last Name</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${lastname}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${email}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Phone Number</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${phoneNo}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Message</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${message}</td>
        </tr>
      </table>
      
      <p style="font-size: 16px; color: #555;">Thank you for reaching out!</p>
      <p style="font-size: 14px; color: #888;">This is an automated message, please do not reply.</p>
    </div>
  `;
  

  // Create a transporter using nodemailer
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // Your email host
    port: 587, // Usually 587 for secure SMTP
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // Your email address (for auth)
      pass: process.env.MAIL_PASS, // Your email password (for auth)
    },
  });

  try {
    // Send the email
    await transporter.sendMail({
      from: `"${firstname} ${lastname}" <${email}>`, // Sender address changes based on form input
      to: "knowledgeworld2580@gmail.com", // Recipient address (fixed)
      subject: title, // Subject line
      html: body, // HTML body content
    });

    // Respond to the client
    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

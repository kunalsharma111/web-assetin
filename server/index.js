const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
// const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contactmail");

const database = require("./config/database");
const cookieParser = require("cookie-parser");

// frontend and backend jodne ke liye cors use krege
var cors = require("cors");

// const { cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// database Connect
database.connect();

// middlewares
app.use(express.json()); // json data parsar
app.use(cookieParser());

// Frontend se request ko block nahi krega
// CORS options
const corsOptions = {
  origin: "*",

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true, // Corrected 'Credentials' to 'credentials'
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

// cloudinary connection
// cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach/", contactRoutes);

// default routes

const default_routes = "https://eduspark-project-industy-level.onrender.com/"; // change when deploy

app.get(default_routes, (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// listen app
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});

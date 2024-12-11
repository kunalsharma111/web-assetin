const express = require("express");
const router = express.Router();

const { contact } = require("../controllers/Contact");
// Define your routes
router.post("/contact", contact);

module.exports = router; // Ensure you are exporting the router correctly

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
// const User = require('../models/User');
const User = require("./../Models/User");
const dotenv = require("dotenv");
const authenticateToken = require("./../MiddleWare/authenticateToken");

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ email, password, firstName, lastName });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600, // 1 hour
    });
    res.cookie("token", token, {
      httpOnly: true, // Prevent access to cookies via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Ensure the cookie is sent only with same-site requests
      maxAge: 3600000, // 1 hour
    });


    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log("req.body", req.body);

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // If the user signed up via Google, the password should be null
    if (!user.password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // console.log("userId", user.id);
    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600, // 1 hour
    });

    // Set the token in an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access to cookies via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Ensure the cookie is sent only with same-site requests
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.get(
  "/google-login",
  passport.authenticate("google", { scope: ["profile",  "email"] })
);

router.get(
  "/google-login/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to dashboard or send token
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    // Redirect back to the frontend with the token in the URL
    res.cookie("token", token, {
      httpOnly: true, // Prevent access to cookies via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Ensure the cookie is sent only with same-site requests
      maxAge: 3600000, // 1 hour
    });
    res.redirect(`https://task-manger-app-gb6t.onrender.com/taskBoard?token=${token}`);
    
    
  }
);

module.exports = router;

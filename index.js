const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const session = require('express-session');
const passport = require("passport");
const cookieParser = require('cookie-parser'); 

require("./config/Passport");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors({ origin: 'https://task-manger-app-gb6t.onrender.com', credentials: true }));
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(session({
    secret: 'taskmanager',
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session()); // If you're using session-based authentication


mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api/taskroute", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

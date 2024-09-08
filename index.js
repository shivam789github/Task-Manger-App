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
const allowedOrigins = ['https://task-manger-app-gb6t.onrender.com', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Origin allowed
    } else {
      callback(new Error('Not allowed by CORS')); // Origin not allowed
    }
  },
  credentials: true, // Allow credentials to be included (cookies, authorization headers, etc.)
}));

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

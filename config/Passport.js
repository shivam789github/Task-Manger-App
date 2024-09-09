const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/User');  
const dotenv = require('dotenv');

dotenv.config();


// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://task-manger-app-1.onrender.com/api/google-login/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    // console.log('profile',profile)

    if (user) {
      // If user exists but doesn't have a googleId, update the user with googleId
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      // Create a new user if not found
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName || "",
        lastName: profile.name.familyName || "",
      });
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

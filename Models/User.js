const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // Store only for users who use email/password login
    required: false,
     default: null
  },
  googleId: {
    type: String, // For Google OAuth
    required: false,
  },
});

module.exports = mongoose.model('User', UserSchema);


// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String, // Store only for users who use email/password login
//     required: false,
//   },
//   googleId: {
//     type: String, // For Google OAuth
//     required: false,
//   },
// });

// module.exports = mongoose.model('User', UserSchema);

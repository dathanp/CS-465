const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  role: {
    type: String,
    enum: ['user', 'admin'], // Define roles: 'user' and 'admin'
    default: 'user' // Default role is 'user'
  }
});

// Method to set password (hash and salt)
userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to validate password
userSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

// Method to generate JWT
userSchema.methods.generateJwt = function() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // Token valid for 7 days

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role, // Include role in the token
    exp: parseInt(expiry.getTime() / 1000, 10), // Expiry in seconds
  }, process.env.JWT_SECRET); // Ensure the JWT secret is stored securely
};

// Export the model
const User = mongoose.model('users', userSchema);
module.exports = User;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (username, password, done) => {
      try {
          //console.log(`Authenticating user: ${username}`);
          // Use async/await instead of callback
          const user = await User.findOne({ email: username });

          if (!user) {
              //console.warn('No user found for email:', username);
              return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
              //console.warn('Invalid password for user:', username);
              return done(null, false, { message: 'Incorrect password.' });
          }
          //console.log('Authentication successful for user:', username);
          return done(null, user);

      } catch (err) {
          //console.error('Error during DB lookup:', err);
          return done(err);
      }
  }
));
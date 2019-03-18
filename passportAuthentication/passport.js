const passport = require('passport');
const User = require('../models/user');
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }).lean().exec((error, user) => {
        if (error) {
            return done(err, null);
        }
        return done(null, user);
    });
});

// Import all our strategies
const twitterStrategy = require('./twitterStrategy');


// Configure our strategies
passport.use('twitter', twitterStrategy);

module.exports = passport;
const passport = require('passport');
const mongojs = require('mongojs');
const db = require('../db');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    db.user.findOne({ _id: mongojs.ObjectID(id) }, (error, user) => {
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
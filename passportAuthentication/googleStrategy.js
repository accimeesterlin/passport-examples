const Strategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

const googleStrategy = new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function (token, tokenSecret, profile, cb) {
        User.findOne({
            profileId: profile.id
        }).lean().exec((err, user) => {
            if (err) {
                return cb(err, null);
            }
            if (user) {
                return cb(null, user);
            }

            let newUser = new User({
                profileId: profile.id,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                username: profile.displayName.toLowerCase().replace(/ /g, ''),
                profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null,
                accessToken: token,
                refreshToken: tokenSecret,
                provider: profile.provider || 'google'
            });

            newUser.save((error, inserted) => {
                if (error) {
                    return cb(error, null);
                }

                return cb(null, inserted);
            });
        });
    }
)

module.exports = googleStrategy;
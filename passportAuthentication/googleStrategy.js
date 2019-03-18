const Strategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

const googleStrategy = new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function (token, tokenSecret, profile, cb) {
        db.user.findOne({
            profileId: profile.id
        }, (err, user) => {
            if (err) {
                return cb(err, null);
            }
            if (user) {
                return cb(null, user);
            }

            let newUser = {
                profileId: profile.id,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                username: profile.displayName.toLowerCase().replace(/ /g, ''),
                profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null,
                accessToken: token,
                refreshToken: tokenSecret,
                provider: profile.provider || 'google'
            };

            db.user.insert(newUser, (error, inserted) => {
                if (error) {
                    return db(error, null);
                }

                return cb(null, inserted);
            })
        });
    }
)

module.exports = googleStrategy;
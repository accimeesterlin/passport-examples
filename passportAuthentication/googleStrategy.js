const Strategy = require('passport-google-oauth20').Strategy;
const db = require('../models');

const googleStrategy = new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function (token, tokenSecret, profile, cb) {
        db.User.findOne({
                where: {
                    profileId: profile.id,
                },
                raw: true
            })
            .then((user) => {

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

                db.User.create(newUser)
                    .then((user) => {
                        newUser.id = user.id;
                        cb(null, newUser)
                    })
                    .catch((error) => {
                        cb(error, null)
                    })
            })
            .catch((error) => cb(error, null));
    }
)

module.exports = googleStrategy;
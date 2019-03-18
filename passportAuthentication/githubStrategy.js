const Strategy = require('passport-github').Strategy;
const db = require('../db');

const githubStrategy = new Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/github/callback"
    },
    function (token, tokenSecret, profile, cb) {
        db.user.findOne({ profileId: profile.id }, (err, user) => {
            if (err) {
                return cb(err, null);
            }
            if (user) {
                return cb(null, user);
            }

            let newUser = {
                profileId: profile.id,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                username: profile.username,
                profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null,
                accessToken: token,
                refreshToken: tokenSecret,
                provider: profile.provider || 'github'
            };

            db.user.insert(newUser, (error, result) => {
                if (error) {
                    return db(error, null);
                }

                return cb(null, result);
            })
        });
    }
)

module.exports = githubStrategy;
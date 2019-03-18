const Strategy = require('passport-twitter').Strategy;
const db = require('../models');

const twitterStrategy = new Strategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:8080/auth/twitter/callback"
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
                username: profile.username,
                profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null,
                accessToken: token,
                refreshToken: tokenSecret,
                provider: profile.provider || 'twitter'
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
        .catch((error) => cb(err, null));
    }
)

module.exports = twitterStrategy;
const Strategy = require('passport-twitter').Strategy;
const User = require('../models/user');

const twitterStrategy = new Strategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:8080/auth/twitter/callback"
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
                username: profile.username,
                profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null,
                accessToken: token,
                refreshToken: tokenSecret,
                provider: profile.provider || 'twitter'
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

module.exports = twitterStrategy;
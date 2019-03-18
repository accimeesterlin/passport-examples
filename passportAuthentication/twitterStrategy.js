const Strategy = require('passport-twitter').Strategy;
const connection = require('../connection');

const twitterStrategy = new Strategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:8080/auth/twitter/callback"
    },
    function (token, tokenSecret, profile, cb) {
        connection.query('SELECT * FROM User WHERE profileId = ?', [profile.id], function (err, users) {
            if (err) {
                return cb(err, null);
            }
            const user = users[0];
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

            // Create a new User
            connection.query('INSERT INTO User SET ?', newUser, (err, data) => {
                if (err) {
                    return cb(null, false, {
                        message: 'Internal Server error'
                    })
                }
                newUser.id = data.insertId;
                return cb(null, newUser);
            });

        });
    }
)

module.exports = twitterStrategy;
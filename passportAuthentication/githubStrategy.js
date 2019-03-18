const Strategy = require('passport-github').Strategy;
const connection = require('../connection');

const githubStrategy = new Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/github/callback"
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
                provider: profile.provider || 'github'
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

module.exports = githubStrategy;
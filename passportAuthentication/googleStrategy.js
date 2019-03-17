const Strategy = require('passport-google-oauth20').Strategy;
const connection = require('../connection');

const GoogleStrategy = new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        connection.query('SELECT * FROM User WHERE googleId = ?', [profile.id], function (err, users) {
            if (err) {
                return cb(err, null);
            }
            const user = users[0];
            if (user) {
                return cb(null, user);
            }

            let newUser = {
                googleId: profile.id,
                email: (profile.emails && profile.emails) ? profile.emails[0].value : null,
                username: profile.displayName.toLowerCase().replace(/ /g, ''),
                profileImage: (profile.photos.length > 0) ? profile.photos[0].value : null
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
);

module.exports = GoogleStrategy;
const Strategy = require('passport-local');
const connection = require('./connection');


module.exports = (passport) => {
    passport.use('local-signup', new Strategy({ passReqToCallback: true },function (req, email, password, cb) {
        // Search user by email in DB
        connection.query('SELECT * FROM User WHERE email = ? ', [email], function(err, users) {
            let message = '';
            if (err) {
                return cb(null, false, { message: 'Internal Server error' });
            }
            const user = users[0];
            // Check user exist
            if (user) {
                message = 'User already exist';
                return cb(null, false, { message });
            }
            
            let newUser = {
                email,
                password // TODO: Please encrypt user password
            };

            // Create a new User
            connection.query('INSERT INTO User SET ?', newUser, (err, data) => {
                if (err) {
                    return cb(null, false, { message: 'Internal Server error' })
                }
                newUser.id = data.insertId;
                return cb(null, newUser);
            });
        });
    }));

    // Login with Passport js
    passport.use('local-signin', new Strategy(function(email, password, cb) {
        // Search user by email in DB
        connection.query('SELECT * FROM User WHERE email = ? ', [email], function(err, users) {
            if (err) {
                return cb(err, null);
            }
            const user = users[0];
            if (!user) {
                return cb('No user found!!', null);
            }

            const userPassword = users[0].password;

            // Validate user password
            if (userPassword !== password) {
                return cb('Email or Password is incorrect', null);
            }
            const currentUser = users[0];
            cb(null, currentUser);
        });
    }));
}
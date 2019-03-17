const Strategy = require('passport-local');
const connection = require('../connection');
const bcrypt = require('bcryptjs');

const loginStrategy = new Strategy({ usernameField: 'email' }, function(email, password, cb) {
    // Search user by email in DB
    connection.query('SELECT * FROM User WHERE email = ? ', email, function(err, users) {
        if (err) {
            return cb({ message: 'Internal Server error', statusCode: 500 }, null);
        }
        const user = users[0];
        if (!user) {
            return cb({ message: 'No user found!!', statusCode: 400 }, null);
        }

        const userPassword = users[0].password;
        const isPasswordValid = bcrypt.compareSync(password, userPassword);

        // Validate user password
        if (!isPasswordValid) {
            return cb({ message: 'Email or Password is incorrect', statusCode: 400 }, null);
        }
        const currentUser = users[0];
        cb(null, currentUser);
    });
});

module.exports = loginStrategy;
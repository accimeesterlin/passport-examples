const Strategy = require('passport-local');
const connection = require('../connection');
const bcrypt = require('bcryptjs');

const localStrategy = new Strategy({ passReqToCallback: true }, function (req, username, password, cb) {
    // Search user by email in DB
    connection.query('SELECT * FROM User WHERE email = ? ', [req.body.email], function(err, users) {
        let message = 'Internal server error';
        if (err) {
            return cb({ message, statusCode: 500 }, null);
        }
        const user = users[0];
        // Check user exist
        if (user) {
            message = 'User already exist';
            return cb({ message, statusCode: 400 }, null);
        }
        
        const salt = bcrypt.genSaltSync(10);
        let newUser = {
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
            position: req.body.position,
            username
        };

        // Create a new User
        connection.query('INSERT INTO User SET ?', newUser, (err, data) => {
            if (err) {
                return cb({ message: 'Internal server error', statusCode: 500 }, null)
            }
            newUser.id = data.insertId;
            return cb(null, newUser);
        });
    });
});

module.exports = localStrategy;
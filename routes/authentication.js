const passport = require('../passportAuthentication');
const express = require('express');
const router = express.Router();

router.get('/logout', function (req, res) {
    req.logout();
    req.session = null;
    res.redirect('/');
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', (req, res, next) => {
    passport.authenticate('github', (error, user, info) => {
        if (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json(error)
        }
        req.login(user, (error) => {
            if (error) {
                const statusCode = error.statusCode || 500;
                return res.status(statusCode).json(error)
            }

            return res.redirect('/profile')
        })
    })(req, res, next);
});

module.exports = router;
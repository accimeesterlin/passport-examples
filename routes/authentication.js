const passport = require('../passportAuthentication');
const express = require('express');
const router = express.Router();

router.get('/logout', function (req, res) {
    req.logout();
    req.session = null;
    res.redirect('/');
});

router.get('/auth/google', passport.authenticate('google', {
    scope: [ 'profile' ]
}));

router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (error, user, info) => {
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
const passport = require('../passportAuthentication');
const express = require('express');
const router = express.Router();

router.get('/logout', function (req, res) {
    req.logout();
    req.session = null;
    res.redirect('/');
});

const sendResponse = function (error, user, info) {
    const req = this.req;
    const res = this.res;

    if (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json(error)
    }
    req.login(user, (error) => {
        if (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json(error)
        }

        return res.json({
            message: 'Successfully processed authentication',
            statusCode: 200
        });
    })
}

router.post('/signup', (req, res, next) => {
    const authenticate = passport.authenticate('local-signup', sendResponse.bind({
        req,
        res
    }));
    authenticate(req, res, next);
});

router.post('/login', (req, res, next) => {
    const authenticate = passport.authenticate('local-signin', sendResponse.bind({
        req,
        res
    }));
    authenticate(req, res, next);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/user');

function checkAuthentication(req, res, next) {
    const isAuthenticate = req.isAuthenticated();
    if (isAuthenticate) {
        if (req.url === '/') {
            return res.redirect('/profile');
        }
        return next();
    }

    if (!isAuthenticate && req.url === '/') {
        return next();
    }

    return res.redirect('/notauthorized');
}

// Secure Routes
router.get('/', checkAuthentication, function (req, res) {
    res.render('home', { title: 'Home - Page' })
});

router.get('/profile', checkAuthentication, function (req, res) {
    User.findOne({ _id: req.user._id }).lean().exec((error, user) => {
        if (error) {
            return res.status(500).json({
                message: 'Internal Error',
                statusCode: 500
            });
        }

        delete user.password;
        res.render('profile', { title: 'Profile - Page', ...user });
    })
    
});

// Public Routes
router.get('/notauthorized', function (req, res) {
    res.render('notauthorized', { title: 'Not Authorized - Pagw' })
});



module.exports = router;
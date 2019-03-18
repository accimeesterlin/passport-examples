const db = require('../db');
const express = require('express');
const mongojs = require('mongojs');
const router = express.Router();

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
    db.user.findOne({ _id: req.user._id }, (error, user) => {
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
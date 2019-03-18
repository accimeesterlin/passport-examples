const express = require('express');
const router = express.Router();
const db = require('../models');

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
    db.User.findOne({
        where: {
            id: req.user.id
        },
        raw: true
    })
        .then((user) => {
            delete user.password;
            res.render('profile', { title: 'Profile - Page', ...user });
        })
        .catch((error) => {
            return res.status(500).json({
                message: 'Internal Error',
                statusCode: 500
            });
        })
    
});

// Public Routes
router.get('/notauthorized', function (req, res) {
    res.render('notauthorized', { title: 'Not Authorized - Pagw' })
});



module.exports = router;
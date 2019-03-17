const path = require('path');
const express = require('express');
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
    res.sendFile(path.join(__dirname, '/../views', 'home.html'));
});

router.get('/profile', checkAuthentication, function (req, res) {
    res.sendFile(path.join(__dirname, '/../views', 'profile.html'));
});

// Public Routes
router.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '/../views', 'login.html'));
});

router.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, '/../views', 'signup.html'));
});

router.get('/notauthorized', function (req, res) {
    res.sendFile(path.join(__dirname, '/../views', 'notauthorized.html'));
});



module.exports = router;
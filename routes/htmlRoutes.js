const connection = require('../connection');
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
    res.render('home', { title: 'Home - Page' })
});

router.get('/profile', checkAuthentication, function (req, res) {
    connection.query('SELECT * FROM User WHERE id = ?', [req.user.id], (error, data) => {
        if (error) {
            return res.status(500).json({
                message: 'Internal Error',
                statusCode: 500
            });
        }

        const user = data[0];
        delete user.password;
        res.render('profile', { title: 'Profile - Page', ...user });
    });
    
});

// Public Routes
router.get('/notauthorized', function (req, res) {
    res.render('notauthorized', { title: 'Not Authorized - Pagw' })
});



module.exports = router;
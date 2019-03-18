const db = require('../models');
const express = require('express');
const router = express.Router();

function checkAuthentication(req, res, next) {
    const isAuthenticate = req.isAuthenticated();
    if (isAuthenticate) {
        return next();
    }

    res.status(401).json({
        message: 'Not authorized',
        statusCode: 401
    });
}

router.get('/user', checkAuthentication, (req, res) => {
    db.User.findOne({
        where: {
            id: req.user.id
        },
        raw: true
    })
    .then((user) => {
        delete user.password;
        return res.status(200).json(user);
    })
    .catch((error) => {
        return res.status(500).json({
            message: 'Internal Error',
            statusCode: 500
        });
    });
});


module.exports = router;
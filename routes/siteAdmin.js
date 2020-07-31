const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get('/', (req, res, next) => {
    User.findAll()
        .then(users => {
            res.render('pages/adminMain', {
                title: 'Main admin page',
                adminContents: 'This is main admin page',
                users: users,
            });
        });
});

router.get('/setup', ( req, res) => {
        res.render('pages/adminSetup', { title: 'Setup admin page' });
});

module.exports = router;

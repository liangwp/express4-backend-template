'use strict';

const express = require('express');
var router = express.Router();

var Promise = require('bluebird');

router.get('/', (req, res, next) => {
    res.json({
        msg: 'working well'
    });
    next();
});

router.get('/error', (req, res, next) => {
    throw new Error('my test error');
});

router.get('/errorp', (req, res, next) => {
    Promise.delay(1500)
    .then(() => {
        throw new Error('my test error wrapped in promise');
    })
    .then(next)
    .catch(next);
});

router.get('/wait', (req, res, next) => {
    Promise.delay(1000)
    .then(() => {
        res.json({
            msg: 'working well'
        });
    })
    .then(next)
    .catch(next);
});

module.exports = router;

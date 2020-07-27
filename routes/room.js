const express = require('express');
const { countries } = require('../models/countries');
const { topics } = require('../models/topics');

const router = express.Router();

router.get('/countries', async (req, res) => {
    try {
        res.send(countries)
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/topics', async (req, res) => {
    try {
        res.send(topics)
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
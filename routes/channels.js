const express = require('express');
const _ = require('lodash');
const { Channel } = require('./../models/channel');

const router = express.Router();

router.post('/channels', async (req, res) => {

    try {
        const body = _.pick(req.body, ['name', 'community']);
        const channel = new Channel(body);
        channel.createdAt = Date.now();
        await channel.save();
        res.send(channel);
    } catch (e) {
        res.status(400).send(e);
    }

});

router.get('/channels/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const channel = await Channel.find({'community._id': id});
        res.send(channel)
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/channels/:id', async (req, res) => {
    try {
        const channel = await Channel.findOneAndRemove({'_id': req.params.id});
        res.send(channel)
    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/channels/:id', async (req, res) => {
    try {
        const channel =  await Channel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.send(channel)
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
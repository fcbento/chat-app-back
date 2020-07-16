const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./../db/mongoose');
const { User } = require('./../models/user');

const router = express.Router();

router.post('/user', async (req, res) => {

    try {
        const body = _.pick(req.body, ['name', 'email', 'password']);
        const user = new User(body);
        user.createdAt = Date.now();
        await user.save();
        const token = await user.generateAuthToken();
        res.header('auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }

});

// All users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send({ users })
    } catch (e) {
        res.status(400).send(e);
    }
});

//User by ID
router.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
        const user = await User.findById(id);
        res.send(user);
    } catch (e) {
        res.status(404).send(e);
    }

});

//User by token
router.get('/user/me', (req, res) => {
    res.send(req.user);
});

//Login user
router.post('/user/login', async(req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('auth', token).send({token});
    } catch (e) {
        res.status(400).send();
    }

});

//Logout removing token passed 
router.delete('/user/me/token', async(req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;
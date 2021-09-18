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
        res.status(400).send({ message: handleError(e.message, req) });
    }

});

router.put('/user/:id', async (req, res) => {

    const id = req.params.id;

    const user = await User.findById(id);

    user.avatar = req.body.avatar;
    
    User.findByIdAndUpdate(user._id, { $set: user }, { new: true }).then((userRes) => {
        res.send(userRes);
    }).catch((e) => {
        res.status(400).send(e);
    });

});

let handleError = (message, req) => {

    if (message.includes(req.body.email) && req.body.email)
        return 'Email already exists'

    if (message.includes('name'))
        return 'Must provide a valid name'

    if (message.includes('password'))
        return 'Must provide a valid password'

    if (message.includes('email'))
        return 'Must provide a valid email'
}

// All users
router.get('/users/:name', async (req, res) => {
    try {
        const users = await User.find({name : { $regex: req.params.name, $options: "i" }});
        res.send(users)
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
router.post('/user/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        user.isOnline = true;
        const token = await user.generateAuthToken();
        res.header('auth', token).send({ token, user });
    } catch (e) {
        res.status(400).send({
            message: 'Email or password is incorrect'
        });
    }

});

//Logout removing token passed 
router.delete('/user/me/token', async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;
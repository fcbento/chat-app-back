const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const { Channel } = require('../models/channel');
const { UserCommunity } = require('./../models/user-community');

const router = express.Router();

router.get('/bymember/:id', async (req, res) => {
    const communities = [];
    const userCommunities = await UserCommunity.find({ "user._id": ObjectID(req.params.id) });

    userCommunities.forEach((user) => {
        user.community.status = user.status;
        communities.push(user.community);
    });
    res.send(communities);
});

router.get('/allmembers/:id', async (req, res) => {
    const userCommunities = await UserCommunity.find({ "community._id": ObjectID(req.params.id) });
    const users = [];
    userCommunities.forEach(user => {
        user.user.status = user.status;
        user.user.isOnline = user.isOnline;
        users.push(user.user);
    });

    res.send(users);
});

router.post('/addmember', async (req, res) => {
    let body = _.pick(req.body, ['user', 'community', 'status']);
    body.user._id = ObjectID(body.user._id);
    body.community._id = ObjectID(body.community._id);

    const userInCommunity = await UserCommunity.find({ 'community._id': ObjectID(body.community._id) });

    const user = userInCommunity.filter((member => member.user._id.toString() == body.user._id.toString()));

    if (user.length > 0) {
        checkExistingObjectId(res, user[0].user, 'User already in this community');
    } else {
        const userCommunity = UserCommunity(body);
        await userCommunity.save();
        res.send().status(201);
    }

});

router.put('/changestatus/:communityId/:userId', async (req, res) => {

    const communityId = req.params.communityId;
    const userId = req.params.userId;

    const userCommunity = await UserCommunity.find({ 'community._id': ObjectID(communityId) });
    const user = userCommunity.filter(member => member.user._id == userId)[0]

    user.status = req.body.status;

    UserCommunity.findByIdAndUpdate(user._id, { $set: user }, { new: true }).then((community) => {
        res.send(community);
    }).catch((e) => {
        res.status(400).send(e);
    });

});

router.put('/useron/:communityId/:userId', async (req, res) => {

    const communityId = req.params.communityId;
    const userId = req.params.userId;

    const userCommunity = await UserCommunity.find({ 'community._id': ObjectID(communityId) });
    const user = userCommunity.filter(member => member.user._id == userId)[0];

    user.isOnline = req.body.status;
    
    UserCommunity.findByIdAndUpdate(user._id, { $set: user }, { new: true }).then((community) => {
        res.send(community);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.put('/useroff/:communityId/:userId', async (req, res) => {

    const communityId = req.params.communityId;
    const userId = req.params.userId;

    const userCommunity = await UserCommunity.find({ 'community._id': ObjectID(communityId) });
    const user = userCommunity.filter(member => member.user._id == userId)[0];

    user.isOnline = req.body.status;

    UserCommunity.findByIdAndUpdate(user._id, { $set: user }, { new: true }).then((community) => {
        res.send(community);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.delete('/removeuser/:communityId/:userId', async (req, res) => {

    const communityId = req.params.communityId;
    const userId = req.params.userId;
    const userCommunity = await UserCommunity.find({ 'community._id': ObjectID(communityId) });
    const user = userCommunity.filter(member => member.user._id == userId)[0]

    if (!user) {
        checkExistingObjectId(res, user[0].user, 'Id not found');
    } else {
        UserCommunity.findOneAndRemove({ "_id": user._id }).then((user) => {
            res.send(user);
        }).catch((e) => {
            res.status(100).send(e);
        });
    }

});

const checkExistingObjectId = (res, body, message) => {
    return res.status(400).send({ error: message, body: body });
}

module.exports = router;
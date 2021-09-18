const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const { Community } = require('../models/community');
const { UserCommunity } = require('../models/user-community');
const router = express.Router();
const fs = require('fs')
const path = require('path'); 

router.post('/communities', async (req, res) => {

    //let uploadLocation = __dirname + '/public/uploads/images/' + req.body.name + '.png';
    // let uploadLocation = path.join(__dirname, `../public/images/${req.body.name}.png`);
    // fs.appendFileSync(uploadLocation, Buffer.toString(req.body.logo));
    
    try {
        const body = _.pick(req.body, ['name', 'owner', 'logo']);
        const community = new Community(body);
        community.createdAt = Date.now();
        await community.save();
        res.send(community);
        createMemberCommunity(community, req, res);
    } catch (e) {
        res.status(400).send(e);
    }

});

router.get('/communities', async (req, res) => {
    try {
        const communities = await Community.find();
        res.send(communities)
    } catch (e) {
        res.status(400).send(e);
    }

});

router.get('/communities/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const community = await Community.findById(id);
        res.send(community)
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/communities/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const community = await Community.findOneAndRemove({ "_id": id });
        const userCommunity = await UserCommunity.remove({ "community._id": ObjectID(id)});
       
        res.status(204).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

router.put('/communities/:id', async (req, res) => {
    try {
        const community = req.body;
        const service = await Community.findByIdAndUpdate(req.params.id, { $set: community }, { new: true });
        res.send(service);
    } catch (e) {
        res.status(400).send(e)
    }
})

const createMemberCommunity = async (community) => {
    let user = community.owner;
    const createdAt = Date.now();
    const status = 2;

    user._id = ObjectID(community.owner._id);

    const userCommunity = UserCommunity({ user, community, status });
    await userCommunity.save();
}

module.exports = router;
const mongoose = require('mongoose');
const _ = require('lodash');

const UserCommunityChannel = new mongoose.Schema({

    user:{
        type: Object,
        required: true
    },

    community:{
        type: Object,
        required: true
    },

    status: {
        type: Number,
        required: true
    },

    isOnline: {
        type: Boolean,
        require: false
    },
    
    createdAt: {
        type: Date,
        required: false,
    }
});

UserCommunityChannel.methods.toJSON = function () {
    var channel = this;
    var channelObj = channel.toObject();

    return _.pick(channelObj, ['_id', 'user', 'community', 'status', 'isOnline']);
};

var UserCommunity = mongoose.model('UserCommunity', UserCommunityChannel);

module.exports = { UserCommunity }
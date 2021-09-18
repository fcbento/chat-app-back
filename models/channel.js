const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const ChannelSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },

    community:{
        type: Object,
        required: false
    },
    
    createdAt: {
        type: Date,
        required: false,
    }
});


ChannelSchema.methods.toJSON = function () {
    var channel = this;
    var channelObj = channel.toObject();

    return _.pick(channelObj, ['_id', 'name', 'community']);
};

var Channel = mongoose.model('Channel', ChannelSchema);

module.exports = { Channel }
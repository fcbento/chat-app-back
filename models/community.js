const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const CommunitySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },

    logo:{
        type: String,
        required: false,
        minlength: 1,
        trim: true 
    },

    owner: {
        type: Object,
        required: true
    },
   
    createdAt: {
        type: Date,
        required: false,
    }
});


CommunitySchema.methods.toJSON = function () {
    var community = this;
    var communityObj = community.toObject();

    return _.pick(communityObj, ['_id', 'name', 'logo', 'owner']);
};

var Community = mongoose.model('Community', CommunitySchema);

module.exports = { Community }
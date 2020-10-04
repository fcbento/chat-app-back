const moment = require('moment');

const generateMessage = (from, text, isYoutube) => {
    return {
        from,
        text,
        createdAt: moment().valueOf(),
        isYoutube
    };
};

module.exports = { generateMessage};
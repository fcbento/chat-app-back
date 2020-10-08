const moment = require('moment');

const generateMessage = (from, text, isYoutube, isAudio) => {
    return {
        from,
        text,
        createdAt: moment().valueOf(),
        isYoutube,
        isAudio
    };
};

module.exports = { generateMessage};
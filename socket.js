const { Users } = require('./utils/users');
const { isRealString } = require('./utils/validation');
const { generateMessage } = require('./utils/message');

const port = process.env.PORT;
const users = new Users();
const multer = require('multer')
const fs = require('fs')

const socketServer = (io, server) => {

    const leaveRoom = (id) => {

        const user = users.removeUser(id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.user} has left`));
        }
    }

    io.on('connection', (socket) => {

        socket.on('disconnect', () => {
            leaveRoom(socket.id);
        });

        socket.on('leaveRoom', () => {
            leaveRoom(socket.id);
        });

        socket.on('createMessage', (message) => {
            let user = users.getUser(socket.id);
            
            if (user && isRealString(message.text) && !message.isAudio) {
                io.to(user.room).emit('newMessage', generateMessage(user, message.text, message.isYoutube, message.isAudio));
            }

            if (user && isRealString(message.text) && message.isAudio) {
                let uploadLocation = __dirname + '/public/uploads/' + message.text.split('/')[3] + '.wav'
                fs.appendFileSync(uploadLocation, Buffer.from(new Uint8Array(message.audioFile)));
                fs.rmdirSync(__dirname + '/public/uploads/', { recursive: true });
                message.text = uploadLocation
                io.to(user.room).emit('newMessage', generateMessage(user, message.text, message.isYoutube, message.isAudio));
            }
        });

        socket.on('join', (params) => {

            const enterRoom = () => {
                socket.join(params.room);
                users.removeUser(socket.id);
                users.addUser(socket.id, params.user.name, params.room);
                io.to(params.room).emit('updateUserList', users.getUserList(params.room));
                io.to(params.room).emit('newMessage', generateMessage('Admin', `${params.user.name} has joined`));
            };

            if (!isRealString(params.user.name) || !isRealString(params.room)) {
                return 'Name and room name are required';
            }

            if (users.getUserList(params.room).length === 0) {
                enterRoom();
            } else if (users.getUserList(params.room)[0] === params.user.name) {
                return 'Already in this room'
            } else {
                enterRoom();
            }
        });

    });

    const port = process.env.PORT || 1337;
    server.listen(port);

}

module.exports = { socketServer }
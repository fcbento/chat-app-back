const { Users } = require('./utils/users');
const { isRealString } = require('./utils/validation');
const { generateMessage } = require('./utils/message');

const port = process.env.PORT;
const users = new Users();

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

        socket.on('leaveRoom', (callback) => {
            callback('leaving');
            leaveRoom(socket.id);
        });

        socket.on('createMessage', (message, callback) => {
            var user = users.getUser(socket.id);
            if (user && isRealString(message.text)) {
                io.to(user.room).emit('newMessage', generateMessage(user, message.text));
            }
            callback();
        });

        socket.on('join', (params, callback) => {

            const enterRoom = () => {
                socket.join(params.room);
                users.removeUser(socket.id);
                users.addUser(socket.id, params.user.name, params.room);
                io.to(params.room).emit('updateUserList', users.getUserList(params.room));
                io.to(params.room).emit('newMessage', generateMessage('Admin', `${params.user.name} has joined`));
                callback();
            };

            if (!isRealString(params.user.name) || !isRealString(params.room)) {
                return callback('Name and room name are required');
            }

            if (users.getUserList(params.room).length === 0) {
                return enterRoom();
            } else {
                let user = users.getUserList(params.room)[0];
       
                if (user === params.user.name) {
                    callback('Already in this room')
                } else {
                    enterRoom();
                }
            }
        });

    });

    const port = process.env.PORT || 1337;
    server.listen(port);

}

module.exports = { socketServer }
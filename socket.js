const { Users } = require('./utils/users');
const { isRealString } = require('./utils/validation');
const { generateMessage } = require('./utils/message');

const port = process.env.PORT;
const users = new Users();

const socketServer = (io, server) => {

    io.on('connection', (socket) => {

        socket.on('disconnect', () => {
            leaveRoom(socket.id);
        });

        socket.on('leaveRoom', (callback) => {
            callback('leaving');
            leaveRoom(socket.id);
        });

        socket.on('join', (params, callback) => {

            const enterRoom = () => {
                socket.join(params.room);
                users.removeUser(socket.id);
                users.addUser(socket.id, params.user.name, params.room);
                io.to(params.room).emit('updateUserList', users.getUserList(params.room));
                socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
                socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.user.name} has joined`));
                callback();
            };

            if (!isRealString(params.user.name) || !isRealString(params.room)) {
                return callback('Name and room name are required');
            }

            if (users.users.length === 0) {
                return enterRoom();
            } else {
                users.users.forEach((user) => {
                    params.user._id === user.user._id ? callback('Already in this room') : enterRoom();
                });
            }
        });

        socket.on('createMessage', (message, callback) => {
            var user = users.getUser(socket.id);
            if (user && isRealString(message.text)) {
                io.to(user.room).emit('newMessage', generateMessage(user.user.name, message.text));
            }
            callback();
        });
    });

    const port = process.env.PORT || 1337;
    server.listen(port);
    console.log('running on ' + port)
    
    const leaveRoom = (id) => {
        const user = users.removeUser(id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.user.name} has left`));
        }
    }
}

module.exports = { socketServer }
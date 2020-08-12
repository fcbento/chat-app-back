class Users {

    constructor() {
        this.users = [];
    }

    addUser(id, user, room) {
        var user = { id, user, room };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var usersObj = users.map((user) => user.user);
        return usersObj;
    }
}

module.exports = { Users }
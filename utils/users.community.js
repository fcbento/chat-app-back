class UsersCommunity {

    constructor() {
        this.users = [];
        this.communityUsers = [];
    }

    addUser(id, user, community) {
        var user = { id, user, community };
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

    getUserList(community) {
        var users = this.users.filter((user) => user.community === community);
        var usersObj = users.map((user) => user.user);
        return usersObj
    }
}

module.exports = { UsersCommunity }
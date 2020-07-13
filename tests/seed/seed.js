const { ObjectID } = require('mongodb');
const { User } = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: 'felipe@example.com',
        name: 'Felipe',
        lastName: 'Bento',
        password: 'userOnePass',
        createdAt:  Date.now(),
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'jen@example.com',
        password: 'userTwoPass',
        name: 'Jeniffer',
        lastName: 'Bento',
        createdAt:  Date.now(),
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
        }]
    }
];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
}

module.exports = { users, populateUsers }
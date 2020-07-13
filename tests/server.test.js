const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { app } = require('./../server');
const { User } = require('./../models/user');
const { users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'exampl@email.com';
        const password = '123456789';
        const name = 'Fe';
        const lastName = 'Be';
        const createdAt = Date.now();

        request(app)
            .post('/users')
            .send({ name, lastName, email, password, createdAt })
            .expect(200)
            .expect((res) => {
                expect(res.headers['auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    //expect(user.password).toBeFalsy();
                    done();
                }).catch((err) => {
                    return done(err)
                })
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'com';
        var password = '12';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);

    });

    it('should not create user if email in use', (done) => {

        request(app)
            .post('/users')
            .send({ email: users[0].email, password: 'users[0].password' })
            .expect(400)
            .end(done);
    });
});

describe('POST /user/login', () => {

    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['auth']
                    });
                    done();
                }).catch((e) => done(e))
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 'we'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e))
            });
    });
});
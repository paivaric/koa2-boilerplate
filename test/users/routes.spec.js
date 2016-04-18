import app from '../../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import chai from 'chai'
import User from '../../api/users/model'

const request = supertest.agent(app.listen())
const expect = chai.expect

describe('user controller', () => {

  describe('create', () => {

    before(User.remove.bind(User));

    let user = {
      name: 'foo',
      email: 'email@email.com',
      password: '*******'
    }

    it('should create user', (done) => {
      request
        .post('/api/v1/users')
        .send(user)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('get one', () => {

    before(User.remove.bind(User));

    let user;
    before( (done) => {
      user = new User();
      user.name = 'foo';
      user.email = 'foo@domain.com';
      user.password = 'pass';
      user.save(done);
    });

    it('should get user', function (done) {
      request
        .get(`/api/v1/users/${user.id}`)
        .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
        .expect(200)
        .expect((res) => {
          console.log(res.body._id)
          expect(res.body._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('update', () => {

    describe('without permission', () => {
      before(User.remove.bind(User));

      let user;
      before( (done) => {
        user = new User();
        user.name = 'foo';
        user.email = 'foo@domain.com';
        user.password = 'pass';
        user.save(done);
      });

      it('should update user', function (done) {
        request
          .put(`/api/v1/users/${user.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .send({name: 'bar'})
          .expect(403)
          .end(done)
      })
    })

    describe('with permission', () => {
      before(User.remove.bind(User));

      let user;
      before( (done) => {
        user = new User();
        user.name = 'foo';
        user.email = 'foo@domain.com';
        user.password = 'pass';
        user.save(done);
      });

      it('should update user', function (done) {
        request
          .put(`/api/v1/users/${user.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .send({name: 'bar'})
          .send({email: 'cannotupdate@gmail.com'})
          .expect(200)
          .expect((res) => {
            expect(res.body.name).to.be.eql('bar')
            expect(res.body.email).to.be.eql(user.email)
          })
          .end(done)
      })
    })
  })

  describe('delete', () => {

    describe('with permission', () => {

      before(User.remove.bind(User));

      let user;
      before( (done) => {
        user = new User();
        user.name = 'foo';
        user.email = 'foo@domain.com';
        user.password = 'pass';
        user.save(done);
      });

      it('should delete user', function (done) {
        request
          .delete(`/api/v1/users/${user.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .expect(200)
          .expect((res) => {
            expect(res.body.name).to.be.eql(user.name)
          })
          .end(done)
      })

      after('should get 404', function (done) {
        request
          .get(`/api/v1/users/${user.id}`)
          .expect(404)
          .end(done)
      })
    })

    describe('without permission', () => {

      before(User.remove.bind(User));

      let user;
      before( (done) => {
        user = new User();
        user.name = 'foo';
        user.email = 'foo@domain.com';
        user.password = 'pass';
        user.save(done);
      });

      it('should delete user', function (done) {
        request
          .delete(`/api/v1/users/${user.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .expect(403)
          .end(done)
      })
    })
  })

})
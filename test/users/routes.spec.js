import app from '../../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import chai from 'chai'
import User from '../../api/users/model'

const request = supertest.agent(app.listen())
const expect = chai.expect

describe('user controller', () => {

  describe('create', () => {

    describe('without valid properties', () => {

      before(User.remove.bind(User))

      let user = {
        name: 'foo',
        password: '*******'
      }

      it('should create user', (done) => {
        request
          .post('/api/v1/users')
          .send(user)
          .expect(400)
          .expect((res) => {
            expect(res.body.email).to.be.eql('Path `email` is required.')
          })
          .end(done)
      })
    })

    describe('with valid properties', () => {

      before(User.remove.bind(User))

      let user = {
        name: 'foo',
        email: 'email@email.com',
        password: '*******'
      }

      it('should create user', (done) => {
        request
          .post('/api/v1/users')
          .send(user)
          .expect(201)
          .expect((res) => {
            expect(res.body._id).to.be.ok
            expect(res.body.name).not.to.be.ok
          })
          .end(done)
      })
    })
  })

  describe('get one', () => {

    before(User.remove.bind(User))

    let user
    before( (done) => {
      user = new User()
      user.name = 'foo'
      user.email = 'foo@domain.com'
      user.password = 'pass'
      user.save(done)
    })

    it('should get user', function (done) {
      request
        .get(`/api/v1/users/${user.id}`)
        .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
        .expect(200)
        .expect((res) => {
          expect(res.body._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('search', () => {

    before(User.remove.bind(User))

    let user
    before( (done) => {
      user = new User()
      user.name = 'foo'
      user.email = 'foo@domain.com'
      user.password = 'pass'
      user.save(done)
    })

    it('should get user', function (done) {
      request
        .get(`/api/v1/users`)
        .query({'name' : 'foo'})
        .query({'$limit' : '1'})
        .query({'$page' : '0'})
        .query({'$select' : 'email'})
        .query({'$sort' : '-name'})
        .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
        .expect(200)
        .expect((res) => {
          expect(res.body[0]._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('update', () => {

    describe('without permission', () => {
      before(User.remove.bind(User))

      let user
      before( (done) => {
        user = new User()
        user.name = 'foo'
        user.email = 'foo@domain.com'
        user.password = 'pass'
        user.save(done)
      })

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
      before(User.remove.bind(User))

      let user
      before(done => {
        user = new User()
        user.name = 'foo'
        user.email = 'foo@domain.com'
        user.password = 'pass'
        user.save(done)
      })

      before(done => {setTimeout(done, 100)})

      it('should update user', function (done) {
        request
          .put(`/api/v1/users/${user.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .send({name: 'bar'})
          .send({email: 'cannotupdate@gmail.com'})
          .expect(200)
          .expect((res) => {
            expect(res.body).to.be.eql({})
          })
          .end(done)
      })

      after('updatedAt must be greater than createdAt', (done) => {
        User.findOne().where('_id').equals(user.id).exec().then(function (storedUser) {
          expect(storedUser.updatedAt.getTime()).to.be.gt(storedUser.createdAt.getTime() + 100)
          done()
        })
      })
    })
  })

  describe('delete', () => {

    describe('with permission', () => {

      before(User.remove.bind(User))

      let user
      before( (done) => {
        user = new User()
        user.name = 'foo'
        user.email = 'foo@domain.com'
        user.password = 'pass'
        user.save(done)
      })

      it('should delete user', function (done) {
        request
          .delete(`/api/v1/users/${user.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .expect(204)
          .expect((res) => {
            expect(res.body).to.be.eql({})
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

      before(User.remove.bind(User))

      let user
      before( (done) => {
        user = new User()
        user.name = 'foo'
        user.email = 'foo@domain.com'
        user.password = 'pass'
        user.save(done)
      })

      it('should get 403', function (done) {
        request
          .delete(`/api/v1/users/${user.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .expect(403)
          .end(done)
      })
    })
  })

})
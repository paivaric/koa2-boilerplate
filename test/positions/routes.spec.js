import app from '../../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import chai from 'chai'
import User from '../../api/users/model'
import Position from '../../api/positions/model'

const request = supertest.agent(app.listen())
const expect = chai.expect

describe('position controller', () => {

  describe('create', () => {

    before(User.remove.bind(User))
    before(Position.remove.bind(Position))

    let user
    before( (done) => {
      user = new User()
      user.name = 'foo'
      user.email = 'foo@domain.com'
      user.password = 'pass'
      user.save(done)
    })

    let position = {
      title: 'title1',
      description: 'description1',
      city: 'city1',
      state: 'state1',
      status: 'status1'
    }

    it('should create position', (done) => {
      request
        .post('/api/v1/positions')
        .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
        .send(position)
        .expect(201)
        .expect((res) => {
          expect(res.body._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('get one', () => {

    before(User.remove.bind(User))
    before(Position.remove.bind(Position))

    let user
    before( (done) => {
      user = new User()
      user.name = 'foo'
      user.email = 'foo@domain.com'
      user.password = 'pass'
      user.save(done)
    })

    let position
    before( (done) => {
      position = new Position()
      position.title = 'title1'
      position.description = 'description1'
      position.city = 'city1'
      position.state = 'state1'
      position.status = 'status1'
      position.createdBy = user
      position.save(done)
    })

    it('should get positions', function (done) {
      request
        .get(`/api/v1/positions/${position.id}`)
        .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
        .expect(200)
        .expect((res) => {
          expect(res.body._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('update', () => {
    before(User.remove.bind(User))
    before(Position.remove.bind(Position))

    let user
    before( (done) => {
      user = new User()
      user.name = 'foo'
      user.email = 'foo@domain.com'
      user.password = 'pass'
      user.save(done)
    })

    let user2
    before( (done) => {
      user2 = new User()
      user2.name = 'foo2'
      user2.email = 'foo2@domain.com'
      user2.password = 'pass2'
      user2.save(done)
    })

    let position
    before( (done) => {
      position = new Position()
      position.title = 'title1'
      position.description = 'description1'
      position.city = 'city1'
      position.state = 'state1'
      position.status = 'status1'
      position.createdBy = user.id
      position.save(done)
    })

    describe('with wrong credentials', () => {

      it('should raise 401', function (done) {
        request
          .put(`/api/v1/positions/${position.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .send({title: 'title updated'})
          .expect(401)
          .end(done)
      })
    })

    describe('without permission', () => {

      it('should raise 403', function (done) {
        request
          .put(`/api/v1/positions/${position.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user2.email}:${user2.password}`).toString('base64'))
          .send({title: 'title updated'})
          .expect(403)
          .end(done)
      })
    })

    describe('with permission', () => {

      it('should update', function (done) {
        request
          .put(`/api/v1/positions/${position.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .send({title: 'title updated'})
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.eql({})
          })
          .end(done)
      })
    })
  })

  describe('delete', () => {

    describe('without permission', () => {

      before(User.remove.bind(User))
      before(Position.remove.bind(Position))

      let user
      before( (done) => {
        user = new User()
        user.name = 'foo'
        user.email = 'foo@domain.com'
        user.password = 'pass'
        user.save(done)
      })

      let otherUser
      before( (done) => {
        otherUser = new User()
        otherUser.name = 'otherUser'
        otherUser.email = 'otherUser@domain.com'
        otherUser.password = 'pass'
        otherUser.save(done)
      })

      let position
      before( (done) => {
        position = new Position()
        position.title = 'title1'
        position.description = 'description1'
        position.city = 'city1'
        position.state = 'state1'
        position.status = 'status1'
        position.createdBy = user.id
        position.save(done)
      })

      it('should raise 401', function (done) {
        request
          .delete(`/api/v1/positions/${position.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .expect(401)
          .end(done)
      })

      it('should raise 403', function (done) {
        request
          .delete(`/api/v1/positions/${position.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${otherUser.email}:pass`).toString('base64'))
          .expect(403)
          .end(done)
      })
    })

    describe('with permission', () => {

      before(User.remove.bind(User))
      before(Position.remove.bind(Position))

      let user
      before( (done) => {
        user = new User()
        user.name = 'foo'
        user.email = 'foo@domain.com'
        user.password = 'pass'
        user.save(done)
      })

      let position
      before( (done) => {
        position = new Position()
        position.title = 'title1'
        position.description = 'description1'
        position.city = 'city1'
        position.state = 'state1'
        position.status = 'status1'
        position.createdBy = user.id
        position.save(done)
      })

      it('should delete', function (done) {
        request
          .delete(`/api/v1/positions/${position.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .expect(204)
          .end(done)
      })

      after('should get 404', function (done) {
        request
          .get(`/api/v1/positions/${position.id}`)
          .expect(404)
          .end(done)
      })
    })
  })

})
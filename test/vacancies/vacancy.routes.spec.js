import app from '../../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import chai from 'chai'
import User from '../../api/users/user.model'
import Vacancy from '../../api/vacancies/vacancy.model.js'

const request = supertest.agent(app.listen())
const expect = chai.expect

describe('vacancy controller', () => {

  describe('create', () => {

    before(User.remove.bind(User))
    before(Vacancy.remove.bind(Vacancy))

    let user
    before((done) => {
      user = new User()
      user.name = 'foo'
      user.email = 'foo@domain.com'
      user.password = 'pass'
      user.save(done)
    })

    let vacancy = {
      title      : 'title1',
      description: 'description1',
      city       : 'city1',
      state      : 'state1',
      status     : 'status1'
    }

    it('should create vacancy', (done) => {
      request
        .post('/api/v1/vacancies')
        .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
        .send(vacancy)
        .expect(201)
        .expect((res) => {
          expect(res.body._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('get one', () => {

    before(User.remove.bind(User))
    before(Vacancy.remove.bind(Vacancy))

    let user
    before((done) => {
      user = new User()
      user.name = 'foo'
      user.email = 'foo@domain.com'
      user.password = 'pass'
      user.save(done)
    })

    let vacancy
    before((done) => {
      vacancy = new Vacancy()
      vacancy.title = 'title1'
      vacancy.description = 'description1'
      vacancy.city = 'city1'
      vacancy.state = 'state1'
      vacancy.status = 'status1'
      vacancy.createdBy = user
      vacancy.save(done)
    })

    it('should get vacancies', function (done) {
      request
        .get(`/api/v1/vacancies/${vacancy.id}`)
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
    before(Vacancy.remove.bind(Vacancy))

    let user
    before((done) => {
      user = new User()
      user.name = 'foo'
      user.email = 'foo@domain.com'
      user.password = 'pass'
      user.save(done)
    })

    let user2
    before((done) => {
      user2 = new User()
      user2.name = 'foo2'
      user2.email = 'foo2@domain.com'
      user2.password = 'pass2'
      user2.save(done)
    })

    let vacancy
    before((done) => {
      vacancy = new Vacancy()
      vacancy.title = 'title1'
      vacancy.description = 'description1'
      vacancy.city = 'city1'
      vacancy.state = 'state1'
      vacancy.status = 'status1'
      vacancy.createdBy = user.id
      vacancy.save(done)
    })

    describe('with wrong credentials', () => {

      it('should raise 401', function (done) {
        request
          .put(`/api/v1/vacancies/${vacancy.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .send({title: 'title updated'})
          .expect(401)
          .end(done)
      })
    })

    describe('without permission', () => {

      it('should raise 403', function (done) {
        request
          .put(`/api/v1/vacancies/${vacancy.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user2.email}:${user2.password}`).toString('base64'))
          .send({title: 'title updated'})
          .expect(403)
          .end(done)
      })
    })

    describe('with permission', () => {

      it('should update', function (done) {
        request
          .put(`/api/v1/vacancies/${vacancy.id}`)
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
      before(Vacancy.remove.bind(Vacancy))

      let user
      before((done) => {
        user = new User()
        user.name = 'foo'
        user.email = 'foo@domain.com'
        user.password = 'pass'
        user.save(done)
      })

      let otherUser
      before((done) => {
        otherUser = new User()
        otherUser.name = 'otherUser'
        otherUser.email = 'otherUser@domain.com'
        otherUser.password = 'pass'
        otherUser.save(done)
      })

      let vacancy
      before((done) => {
        vacancy = new Vacancy()
        vacancy.title = 'title1'
        vacancy.description = 'description1'
        vacancy.city = 'city1'
        vacancy.state = 'state1'
        vacancy.status = 'status1'
        vacancy.createdBy = user.id
        vacancy.save(done)
      })

      it('should raise 401', function (done) {
        request
          .delete(`/api/v1/vacancies/${vacancy.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .expect(401)
          .end(done)
      })

      it('should raise 403', function (done) {
        request
          .delete(`/api/v1/vacancies/${vacancy.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${otherUser.email}:pass`).toString('base64'))
          .expect(403)
          .end(done)
      })
    })

    describe('with permission', () => {

      before(User.remove.bind(User))
      before(Vacancy.remove.bind(Vacancy))

      let user
      before((done) => {
        user = new User()
        user.name = 'foo'
        user.email = 'foo@domain.com'
        user.password = 'pass'
        user.save(done)
      })

      let vacancy
      before((done) => {
        vacancy = new Vacancy()
        vacancy.title = 'title1'
        vacancy.description = 'description1'
        vacancy.city = 'city1'
        vacancy.state = 'state1'
        vacancy.status = 'status1'
        vacancy.createdBy = user.id
        vacancy.save(done)
      })

      it('should delete', function (done) {
        request
          .delete(`/api/v1/vacancies/${vacancy.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .expect(204)
          .end(done)
      })

      after('should get 404', function (done) {
        request
          .get(`/api/v1/vacancies/${vacancy.id}`)
          .expect(404)
          .end(done)
      })
    })
  })

})
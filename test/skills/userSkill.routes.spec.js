import app from '../../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import chai from 'chai'
import User from '../../api/users/user.model'
import UserSkill from '../../api/skills/userSkill.model'


const request = supertest.agent(app.listen())
const expect = chai.expect

describe('skill controller', () => {

  before(User.remove.bind(User))

  let user

  before(done => {
    user = new User()
    user.name = 'foo'
    user.email = 'foo@email.com'
    user.password = 'pass'
    user.save(done)
  })
  let otherUser

  before(done => {
    otherUser = new User()
    otherUser.name = 'bar'
    otherUser.email = 'bar@email.com'
    otherUser.password = 'pass'
    otherUser.save(done)
  })

  describe('create', () => {

    describe('without valid properties', () => {

      before(UserSkill.remove.bind(UserSkill))

      let skill = {}

      it('should create user', (done) => {
        request
          .post('/api/v1/user-skills')
          .send(skill)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .expect(400)
          .expect((res) => {
            expect(res.body.name).to.be.eql('Path `name` is required.')
            expect(res.body.language).to.be.eql('Path `language` is required.')
            expect(res.body.category).to.be.eql('Path `category` is required.')
          })
          .end(done)
      })
    })

    describe('with valid properties', () => {

      before(UserSkill.remove.bind(UserSkill))

      let skill = {
        name    : 'name',
        level   : 1,
        category: 'SALARY',
        language: 'en'
      }

      it('should create user skill', (done) => {
        console.log(skill)
        request
          .post('/api/v1/user-skills')
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .send(skill)
          .expect(201)
          .expect((res) => {
            expect(res.body._id).to.be.ok
            expect(res.body.level).not.to.be.ok
            expect(res.body.name).not.to.be.ok
            expect(res.body.category).not.to.be.ok
            expect(res.body.language).not.to.be.ok
          })
          .end(done)
      })
    })
  })

  describe('get one', () => {

    before(UserSkill.remove.bind(UserSkill))

    let skill
    before((done) => {
      skill = new UserSkill({
        name     : 'name',
        level    : 1,
        category : 'SALARY',
        language : 'en',
        createdBy: user
      })
      skill.save(done)
    })

    it('should get user skill', function (done) {
      request
        .get(`/api/v1/user-skills/${skill.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('search', () => {

    before(UserSkill.remove.bind(UserSkill))

    let skill
    before((done) => {
      skill = new UserSkill({
        name     : 'foo',
        level    : 1,
        category : 'SALARY',
        language : 'en',
        createdBy: user
      })
      skill.save(done)
    })

    it('should get user skills', function (done) {
      request
        .get(`/api/v1/user-skills`)
        .query({'name': 'foo'})
        .query({'$limit': '1'})
        .query({'$page': '0'})
        .query({'$select': 'email'})
        .query({'$sort': '-name'})
        .expect(200)
        .expect((res) => {
          expect(res.body[0]._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('update', () => {

    describe('without permission', () => {
      before(UserSkill.remove.bind(UserSkill))

      let skill
      before((done) => {
        skill = new UserSkill({
          name     : 'foo',
          level    : 1,
          category : 'SALARY',
          language : 'en',
          createdBy: user
        })
        skill.save(done)
      })

      it('should raise 401', function (done) {
        request
          .put(`/api/v1/user-skills/${skill.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .send({name: 'bar'})
          .expect(401)
          .end(done)
      })

      it('should raise 403', function (done) {
        request
          .put(`/api/v1/user-skills/${skill.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${otherUser.email}:${otherUser.password}`).toString('base64'))
          .send({name: 'bar'})
          .expect(403)
          .end(done)
      })
    })

    describe('with permission', () => {
      before(UserSkill.remove.bind(UserSkill))

      let skill
      before((done) => {
        skill = new UserSkill({
          name     : 'foo',
          level    : 1,
          category : 'SALARY',
          language : 'en',
          createdBy: user
        })
        skill.save(done)
      })

      before(done => {
        setTimeout(done, 100)
      })

      it('should update user', function (done) {
        request
          .put(`/api/v1/user-skills/${skill.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .send({name: 'updated'})
          .expect(200)
          .expect((res) => {
            expect(res.body).to.be.eql({})
          })
          .end(done)
      })

      after('updatedAt must be greater than createdAt', (done) => {
        UserSkill.findOne().where('_id').equals(skill.id).exec().then(function (storedSkill) {
          expect(storedSkill.updatedAt.getTime()).to.be.gt(storedSkill.createdAt.getTime() + 100)
          done()
        })
      })
    })
  })

  describe('delete', () => {

    describe('with permission', () => {

      before(UserSkill.remove.bind(UserSkill))

      let skill
      before((done) => {
        skill = new UserSkill({
          name     : 'foo',
          level    : 1,
          category : 'SALARY',
          language : 'en',
          createdBy: user
        })
        skill.save(done)
      })

      it('should delete user skill', function (done) {
        request
          .delete(`/api/v1/user-skills/${skill.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
          .expect(204)
          .expect((res) => {
            expect(res.body).to.be.eql({})
          })
          .end(done)
      })

      after('should get 404', function (done) {
        request
          .get(`/api/v1/user-skills/${skill.id}`)
          .expect(404)
          .end(done)
      })
    })

    describe('without permission', () => {

      before(UserSkill.remove.bind(UserSkill))

      let skill
      before((done) => {
        skill = new UserSkill({
          name     : 'foo',
          level    : 1,
          category : 'SALARY',
          language : 'en',
          createdBy: user
        })
        skill.save(done)
      })

      it('should raise 401', function (done) {
        request
          .delete(`/api/v1/user-skills/${skill.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
          .expect(401)
          .end(done)
      })

      it('should raise 403', function (done) {
        request
          .delete(`/api/v1/user-skills/${skill.id}`)
          .set('authorization', 'Basic ' + new Buffer(`${otherUser.email}:${otherUser.password}`).toString('base64'))
          .expect(403)
          .end(done)
      })
    })
  })

})
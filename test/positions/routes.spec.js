import app from '../../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import chai from 'chai'
import User from '../../api/users/model'

const request = supertest.agent(app.listen())
const expect = chai.expect

describe('user controller', () => {

  before(User.remove.bind(User));

  describe('create', () => {
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

})
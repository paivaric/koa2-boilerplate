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

    before(User.remove.bind(User));
    before(Position.remove.bind(Position));

    let user;
    before( (done) => {
      user = new User();
      user.name = 'foo';
      user.email = 'foo@domain.com';
      user.password = 'pass';
      user.save(done);
    });

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
        .expect(200)
        .expect((res) => {
          expect(res.body._id).to.be.ok
        })
        .end(done)
    })
  })

  describe('get one', () => {

    before(User.remove.bind(User));
    before(Position.remove.bind(Position));

    let user;
    before( (done) => {
      user = new User();
      user.name = 'foo';
      user.email = 'foo@domain.com';
      user.password = 'pass';
      user.save(done);
    });

    let position;
    before( (done) => {
      position = new Position();
      position.title = 'title1';
      position.description = 'description1';
      position.city = 'city1';
      position.state = 'state1';
      position.status = 'status1';
      position.createdBy = user;
      position.save(done);
    });

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

  // describe('update', () => {

  //   describe('without permission', () => {
  //     before(User.remove.bind(User));

  //     let user;
  //     before( (done) => {
  //       user = new User();
  //       user.name = 'foo';
  //       user.email = 'foo@domain.com';
  //       user.password = 'pass';
  //       user.save(done);
  //     });

  //     it('should update user', function (done) {
  //       request
  //         .put(`/api/v1/users/${user.id}`)
  //         .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
  //         .send({name: 'bar'})
  //         .expect(403)
  //         .end(done)
  //     })
  //   })

  //   describe('with permission', () => {
  //     before(User.remove.bind(User));

  //     let user;
  //     before( (done) => {
  //       user = new User();
  //       user.name = 'foo';
  //       user.email = 'foo@domain.com';
  //       user.password = 'pass';
  //       user.save(done);
  //     });

  //     it('should update user', function (done) {
  //       request
  //         .put(`/api/v1/users/${user.id}`)
  //         .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
  //         .send({name: 'bar'})
  //         .send({email: 'cannotupdate@gmail.com'})
  //         .expect(200)
  //         .expect((res) => {
  //           expect(res.body.name).to.be.eql('bar')
  //           expect(res.body.email).to.be.eql(user.email)
  //         })
  //         .end(done)
  //     })
  //   })
  // })

  // describe('delete', () => {

  //   describe('with permission', () => {

  //     before(User.remove.bind(User));

  //     let user;
  //     before( (done) => {
  //       user = new User();
  //       user.name = 'foo';
  //       user.email = 'foo@domain.com';
  //       user.password = 'pass';
  //       user.save(done);
  //     });

  //     it('should delete user', function (done) {
  //       request
  //         .delete(`/api/v1/users/${user.id}`)
  //         .set('authorization', 'Basic ' + new Buffer(`${user.email}:${user.password}`).toString('base64'))
  //         .expect(200)
  //         .expect((res) => {
  //           expect(res.body.name).to.be.eql(user.name)
  //         })
  //         .end(done)
  //     })

  //     after('should get 404', function (done) {
  //       request
  //         .get(`/api/v1/users/${user.id}`)
  //         .expect(404)
  //         .end(done)
  //     })
  //   })

  //   describe('without permission', () => {

  //     before(User.remove.bind(User));

  //     let user;
  //     before( (done) => {
  //       user = new User();
  //       user.name = 'foo';
  //       user.email = 'foo@domain.com';
  //       user.password = 'pass';
  //       user.save(done);
  //     });

  //     it('should delete user', function (done) {
  //       request
  //         .delete(`/api/v1/users/${user.id}`)
  //         .set('authorization', 'Basic ' + new Buffer(`${user.email}:wrongpass`).toString('base64'))
  //         .expect(403)
  //         .end(done)
  //     })
  //   })
  // })

})
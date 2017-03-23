var should = require('should')
var request = require('supertest')

var app = require('./server')

describe('Routes', () => {
  describe('/fake', () => {
    it('should return the version number', (done) => {

      request(app)
	      .get('/fake')
        .expect(200)
	      .then((res) => {
          (res.body).should.be.deepEqual({version: 1})
          done()
        })
    })
  })
  describe('/fake/register', () => {
    it('should correctly create an existing account', (done) => {
	    var body = {
		    user: {
          email: "test@easysign.com",
          password: "password"
        }
	     }
	    request(app)
		    .post('/fake/register')
		    .send(body)
		    .expect('Content-Type', /json/)
		    .expect(200)
		    .then((res) => {
			    done()
		    })
	  })
    it('should return an error if invalid credentials', (done) => {
      let body = {
        user: {}
      }
      request(app)
        .post('/fake/register')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(422)
        .then((res) => {
          done()
        })
    })
  })
})

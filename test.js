var should = require('should')
var request = require('supertest')

var app = require('./server')

let invalidCredentials = (url, method = 'POST') => {
  return (done) => {
    (method !== 'GET' ? request(app).post(url) : request(app).get(url))
      .expect('Content-Type', /json/)
      .expect(401)
      .then((res) => {
        done()
      })
  }
}

describe('Routes', () => {
  describe('GET /fake', () => {
    it('should return the version number', (done) => {
      request(app)
	      .get('/fake')
        .expect(200)
	      .then((res) => {
          (res.body).should.has.property('version', 1)
          done()
        })
    })
  })
  describe('POST /fake/register', () => {
    it('should correctly create an account', (done) => {
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
  describe('POST /fake/register/:uuid', () => {
    it('should return an error if invalid credentials', invalidCredentials('/fake/register/ae478f75'))
    it('should return an error if invalid signature set', (done) => {
      let body = {
        user: {
          signatures: [[1], [2], [3], [4]]
        }
      }
      request(app)
        .post('/fake/register/ae478f75')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(422)
        .then((res) => {
          done()
        })
    })
    it('should return success if correct signature set', (done) => {
      let body = {
        user: {
          signatures: [[1], [2], [3], [4], [5]]
        }
      }
      request(app)
        .post('/fake/register/ae478f75')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          done()
        })
    })
  })
  describe('POST /fake/login', () => {
    it('should return an error if invalid credentails', invalidCredentials('/fake/login'))
    it('should return a token and the uuid if correct credentials', (done) => {
      let body = {
        user: {
          email: "test@easysign.com",
          password: "password"
        }
      }
      request(app)
        .post('/fake/login')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          res.body.token.should.be.equal("c778aacd6c1d6007643d32cbed8afbb8")
          res.body.uuid.should.be.equal("ae478f75")
        })
        .then((res) => {
          done()
        })
    })
  })
  describe('POST /fake/request', () => {
    it('should return an error if invalid credentials', invalidCredentials('/fake/request', 'GET'))
    it('should accept a document id', (done) => {
      let body = {
        document: {
          id: "5b83d596a85edc1a35f9592e9cd19212"
        }
      }
      request(app)
        .post('/fake/request')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          done()
        })
    })
  })
  describe('GET /fake/request', () => {
    it('should return an error if invalid credentials', invalidCredentials('/fake/request/1'))
    it('should return an array of request ids if correct credetials', (done) => {
      request(app)
        .get('/fake/request')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          res.body.requests.should.be.deepEqual(["5b83d596a85edc1a35f9592e9cd19212", "a6f92c80f70b7f9da5997e618fb57e0a"])
        })
        .then((res) => {
          done()
        })
    })
  })
  describe('POST /fake/request/:id', () => {
    it('should return an error if invalid credentials', invalidCredentials('/fake/request/1'))
    it('should return an error if invalid signature', (done) => {
      let body = {
        signature: "invalid"
      }
      request(app)
        .post('/fake/request/1')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(401)
        .then((res) => {
          done()
        })
    })
    it('should return an error if document not found', (done) => {
      let body = {
        signature: [["valid"]]
      }
      request(app)
        .post('/fake/request/40')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((res) => {
          done()
        })
    })
    it('should accept a correct signature', (done) => {
      let body = {
        signature: [["valid"]]
      }
      request(app)
        .post('/fake/request/4')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          done()
        })
    })
  })
  describe('GET /fake/request/:id', () => {
    it('should return an error if invalid credentials', invalidCredentials('/fake/request/1', 'GET'))
    it('should return an error if request not found', (done) => {
      request(app)
        .get('/fake/request/40')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .expect('Content-Type', /json/)
        .expect(404)
        .then((res) => {
          done()
        })
    })
    it('should return a no content if no signature is present', (done) => {
      request(app)
        .get('/fake/request/4')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .expect(204)
        done()
    })
    it('should return the signature if it is present', (done) => {
      request(app)
        .get('/fake/request/3')
        .set('token', 'c778aacd6c1d6007643d32cbed8afbb8')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          res.body.should.have.property('signature').which.is.an.Array()
        })
        .then((res) => {
          done()
        })
    })
  })
})

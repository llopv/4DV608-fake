var express = require('express')
var bodyParser = require('body-parser');
var app = express()

app.use(bodyParser.json());

var invalidCredentials = (req, res) => {
  if (!req.headers.token || !req.headers.token === "c778aacd6c1d6007643d32cbed8afbb8") {
    res.status(401).json({error: "Invalid credentials"})
    return true
  }
}

app.get('/fake', (req, res) => {
  res.json({version: 1, revision: 1})
})

app.post('/fake/register', (req, res) => {
  if (!req.body.user || !req.body.user.email || !req.body.user.password) {
    res.status(422).json({error: "Invalid email"})
    return
  }
  if (req.body.user.email === 'used@e.mail') {
    res.status(442).json({error: "Email already in use"})
  }
  res.json({uuid: "ae478f75", token: "c778aacd6c1d6007643d32cbed8afbb8"})
})

app.post('/fake/register/:uuid', (req, res) => {
  if (invalidCredentials(req, res)) return
  if (!req.body.user || !req.body.user.signatures
    || req.body.user.signatures.length != 5 || !Array.isArray(req.body.user.signatures[0])) {
    res.status(422).json({error: "Invalid signatures"})
    return
  }
  res.json({success: true})
})

app.post('/fake/login', (req, res) => {
  if (!req.body.user || !req.body.user.email || !req.body.user.password) {
    res.status(401).json({error: "Invalid credentials"})
    return
  }
  res.json({token: "c778aacd6c1d6007643d32cbed8afbb8", uuid: "ae478f75"})
})

app.post('/fake/request', (req, res) => {
  if (invalidCredentials(req, res)) return
  if (!req.body.document || !req.body.document.id) {
    console.error("no document id")
  }
  res.json({})
})

app.get('/fake/request', (req, res) => {
  if (invalidCredentials(req, res)) return
  res.json({requests: ["5b83d596a85edc1a35f9592e9cd19212", "a6f92c80f70b7f9da5997e618fb57e0a"]})
})

app.post('/fake/request/:id', (req, res) => {
  if (invalidCredentials(req, res)) return
  if (req.params.id > 10) {
    res.status(404).json({error: "Request not found"})
    return
  }
  if (!req.body.signature || !Array.isArray(req.body.signature)) {
    res.status(401).json({error: "Invalid signature"})
    return
  }
  res.json({})
})

app.get('/fake/request/:id', (req, res) => {
  if (invalidCredentials(req, res)) return
  if (req.params.id > 10) {
    res.status(404).json({error: "Request not found"})
    return
  }
  try {
    let signature = require('./stubs/sig'+parseInt(req.params.id)+'.json')
    res.json({signature})
  } catch(e) {
    res.status(204) // No content
  }
})

app.listen(8000, () => {
  console.log('Fake server listening on http://localhost:8000!')
})

module.exports = app

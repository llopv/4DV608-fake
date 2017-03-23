var express = require('express')
var bodyParser = require('body-parser');
var app = express()

app.use(bodyParser.json());

app.get('/fake', (req, res) => {
  res.json({version: 1})
})

app.post('/fake/register', (req, res) => {
  if (!req.body.user || !req.body.user.email || !req.body.user.password) {
    res.status(422).json({error: "Invalid email"})
    return
  }
  res.json({uuid: "ae478f75"})
})

app.post('/fake/register/:uuid', (req, res) => {
  res.json({})
})

app.post('/fake/login', (req, res) => {
  res.json({token: "c778aacd6c1d6007643d32cbed8afbb8", uuid: "ae478f75"})
})

app.post('/fake/request', (req, res) => {
  res.json({})
})

app.get('/fake/request', (req, res) => {
  res.json({requests: ["ae478f75"]})
})

app.post('/fake/request/:id', (req, res) => {
  res.json({})
})

app.get('/fake/request/:id', (req, res) => {
  try {
    let signature = require('./stubs/sig'+parseInt(req.params.id)+'.json')
    res.json({signature})
  } catch(e) {
    res.status(404).json({error: "Signature not found"})
  }
})

app.listen(8000, () => {
  console.log('Fake server listening on http://localhost:8000!')
})

module.exports = app

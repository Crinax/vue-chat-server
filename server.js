const express = require('express');
const cors = require('cors');
const API = require('./api/api.js');

require('dotenv').config();

const app = express();
const port = 3000;

API.init();

app.use(express.json());
app.use(cors());
app.all('*', function(req, res, next) {
  var origin = req.get('origin');
  res.header('Access-Control-Allow-Origin', origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/chat', async (req, res) => {
  res.send(await API.getChat());
});

app.get('/users', async (req, res) => {
  res.send(await API.getUsers());
});

app.post('/message', async (req, res) => {
  res.send(await API.postMessage(req.body.login, req.body.message));
});

app.post('/auth', async (req, res) => {
  res.send(await API.auth(req.body.login, req.body.password))
})

app.listen(port, () => {
  console.log('Listening http://localhost:3000/');
});

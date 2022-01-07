const express = require('express');
const API = require('./api/api.js');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
API.init();

app.get('/journal', async (req, res) => {
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

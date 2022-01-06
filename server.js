const express = require('express');
const API = require('./api/api.js');

const app = express();
const port = 3000;

API.init();

app.get('/journal', async (req, res) => {
  res.send(await API.getJournal());
});

app.get('/users', async (req, res) => {
  res.send(await API.getUsers());
});

app.post('/message', (req, res) => {
  res.send(API.postMessage(req.body));
});

app.listen(port, () => {
  console.log('Listening http://localhost:3000/');
});

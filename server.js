require('dotenv').config();

const { WebSocketServer } = require('ws');

const API = require('./api/api.js');
const Commander = require('./commander');

API.init();

const wss = new WebSocketServer({ port: process.env.WS_PORT });

async function onMessage(request) {
  const data = JSON.parse(request.toString('utf-8'));
  const command = new Commander(data.action, data.body);

  this.send(await command.resolve());
};

const onConnection = async (client) => {
  await client.on('message', onMessage.bind(client));
};

wss.on('connection', onConnection);

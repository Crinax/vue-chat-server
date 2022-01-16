const { WebSocketServer } = require('ws');

const API = require('./api/api.js');
const Commander = require('./commander');

require('dotenv').config();
API.init();

const wss = new WebSocketServer({ port: process.env.WS_PORT });

const onMessage = async (request) => {
  const data = JSON.parse(request);
  const command = new Commander(data.target, data.body);

  wss.send(await command.resolve());
};

const onConnection = async (client) => {
  await client.on('message', onMessage);

  console.log(client);
};

wss.on('connection', onConnection);

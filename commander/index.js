const API = require('../api/api.js');

class Commander {
    constructor(command, body) {
        this.command = command;
        this.body = body;
        this.request = this.commands[this.command];
    }

    command;
    body;
    request;
    commands = {
        'chat': API.getChat,
        'users': API.getUsers,
        'user->auth': API.authUser,
        'auth': API.authApi,
        'chat->send': API.addMessage,
        'ping': async () => { message: 'pong' }
    };

    async resolve() {
        if (!API.isAuthorized && this.command !== 'auth' && this.command !== 'ping') {
            return API.respondError('unauthorized');
        }

        if (this.request) {
            return API.respond(await this.request(this.body));
        }

        return API.respondError('unknown command');
    }

}

module.exports = Commander;

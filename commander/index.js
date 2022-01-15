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
    };

    async resolve() {
        if (!API.isAuthorized && this.command !== 'auth') {
            return API.respondError('unauthorized');
        }

        if (this.request) {
            return await API.respond(this.request(this.body));
        }

        return API.respondError('unknown command');
    }

}

module.exports = Commander;

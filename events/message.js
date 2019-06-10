const ping = require('../commands/ping');
const wiki = require('../commands/wiki.js');
const enchant = require('../commands/enchant');
const help = require('../commands/help');
const { changeRaidChannel } = require('../commands/timers');

// TODO: Use database to store whitelist
const whitelist = [
    'botboi',
    'admin',
    'Officers',
];

module.exports = {
    default: async (client, message) => {
        if (message.content === '!ping') {
            return ping(message);
        }

        if (message.content.startsWith('!enchant')) {
            return await enchant(message);
        }

        if (message.content.startsWith('!wiki ')) {
            return await wiki(message);
        }

        if (message.content.startsWith('!help')) {
            return help(message);
        }

        if (message.content.startsWith('!raid')) {
            if(message.member.roles.find(r => whitelist.includes(r.name))) {
                return changeRaidChannel(message);
            } else {
                return null;
            }
        }
    },
};

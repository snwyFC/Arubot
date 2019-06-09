const ping = require('../commands/ping');
const wiki = require('../commands/wiki.js');
const enchant = require('../commands/enchant');
const { changeRaidChannel } = require('../commands/timers');

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

    if (message.content.startsWith('!raid')) {
        return changeRaidChannel(message);
    }
  },
};

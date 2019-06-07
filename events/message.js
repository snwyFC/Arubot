const ping = require('../commands/ping');
const enchant = require('../commands/enchant');

module.exports = async (client, message) => {
  if (message.content === '!ping') {
    return ping(message);
  }

  if (message.content.startsWith('!enchant')) {
    return await enchant(message);
  }
};

const ping = require('../commands/ping');
const enchant = require('../commands/enchant');
const wiki = require('../commands/wiki.js');

module.exports = async (client, message) => {
  if (message.content === '!ping') {
    return ping(message);
  }

  if (message.content.startsWith('!enchant')) {
    return await enchant(message);
  }

  if (message.content.startsWith('!wiki ')) {
    return await wiki(message);
  }

};

require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const { timers } = require('./commands/timers');
const client = new Discord.Client();

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventModule = require(`./events/${file}`);
    const { default: eventHandler } = eventModule;
    const eventName = file.split('.')[0];

    client.on(eventName, (...args) => eventHandler(client, ...args));
  });
});

timers(client);

client.login(process.env.BOT_TOKEN);

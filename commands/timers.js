const cron = require('node-cron');

let raidChannel = 'general';

module.exports = {
    timers: (client) => {
        // Black Dragon 

        // BD Morning Time
        cron.schedule('*/1 * * * *', () => {
            const channel = client.channels.find('name', channel => channel.name === raidChannel);
            channel.send('@channel Black dragon is spawning!');
        });

        // BD Evening Time
        cron.schedule('* 19 * * *', () => {
            const channel = client.channels.find('name', channel => channel.name === raidChannel);
            channel.send('@channel Black dragon is spawning!');
        });

        // -----------------------------

        // White Dragon

        // Desert Dragon

        // Prairie Dragon

        // Red Dragon

        // Sandworm

        // Alligator
    },

    changeRaidChannel: (message) => {
        const inpt = message.content // the message/command issued by the user
        const channel = inpt.split(' ')[1] // removes the "!enchant " from the message

        raidChannel = channel;

        const channelName = message.guild.channels.find(channel => channel.name === raidChannel).toString();

        return message.reply (`Changed raid channel to ${channelName}`);
    },
}
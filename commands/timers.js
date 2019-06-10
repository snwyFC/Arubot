const CronJob = require('cron').CronJob;

let raidChannel = null;

const TIMERS = [
    ['0 0 11 * * *', 'Black Dragon is spawning!'],
    ['0 0 19 * * *', 'Black Dragon is spawning!'],
    ['0 30 11 * * *', 'White Dragon is spawning!'],
    ['0 30 19 * * *', 'White Dragon is spawning!'],
    ['0 30 10 * * *', 'Desert Dragon is spawning!'],
    ['0 0 17 * * *', 'Desert Dragon is spawning!'],
    ['0 0 15 * * *', 'Prairie Dragon is spawning!'],
    ['0 0 19 * * *', 'Prairie Dragon is spawning!'],
    ['0 0 16 * * *', 'Red Dragon is spawning!'],
    ['0 0 21 * * *', 'Red Dragon is spawning!'],
    ['0 0 10 * * *', 'Sandworm is spawning!'],
    ['0 0 23 * * *', 'Sandworm is spawning!'],
    ['0 0 15 * * *', 'Alligator is spawning!'],
    ['0 0 18 * * *', 'Alligator is spawning!'],
];

module.exports = {
    timers: (client) => {
        TIMERS.forEach(([ time, message ]) => {
            new CronJob(time, () => {
                raidChannel.send(message);
            }, null, true, 'America/Los_Angeles');
        });
    },

    changeRaidChannel: (message) => {
        const inpt = message.content // the message/command issued by the user
        const channelName = inpt.split(' ')[1] // removes the "!enchant " from the message
        const channel = message.guild.channels.find(channel => channel.name === channelName);

        if (channel) {
            raidChannel = channel;

            return message.reply (`Changed raid channel to ${channel.toString()}`);
        } else {
            return message.reply('Channel not found!');
        }
    },
}

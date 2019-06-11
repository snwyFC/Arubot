const CronJob = require('cron').CronJob;
const moment = require('moment-timezone');

let raidChannel = null;

const TIMERS = [
    ['0 0 11 * * *', 'Black Dragon is spawning for the next 15 minutes!'],
    ['0 0 19 * * *', 'Black Dragon is spawning for the next 15 minutes!'],
    ['0 30 11 * * *', 'White Dragon is spawning for the next 15 minutes!'],
    ['0 30 19 * * *', 'White Dragon is spawning for the next 15 minutes!'],
    ['0 30 10 * * *', 'Desert Dragon is spawning for the next 30 minutes!'],
    ['0 0 17 * * *', 'Desert Dragon is spawning for the next 30 minutes!'],
    ['0 0 15 * * *', 'Prairie Dragon is spawning for the next 30 minutes!'],
    ['0 0 19 * * *', 'Prairie Dragon is spawning for the next 30 minutes!'],
    ['0 0 16 * * *', 'Red Dragon is spawning for the next 30 minutes!'],
    ['0 0 21 * * *', 'Red Dragon is spawning for the next 30 minutes!'],
    ['0 0 10 * * *', 'Sandworm is spawning!'],
    ['0 0 23 * * *', 'Sandworm is spawning for the next 30 minutes!'],
    ['0 0 15 * * *', 'Giant Alligator is spawning for the next 30 minutes!'],
    ['0 0 18 * * *', 'Giant Alligator is spawning for the next 30 minutes!'],
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

    setTimer: (message) => {
        const testArray = message.content.split(' ');
        const modifier = testArray[1];

        // Validates message length
        if(testArray.length < 5) {
            return message.channel.send('invalid format, please try again');
        }

        // Validates date string
        if(testArray[2].length != 5) {
            return message.channel.send('invalid date format, please try again');
        }

        // Validates time format
        if(testArray[3].length != 4) {
            return message.channel.send('invalid time format, please try again');
        }

        const dateString = testArray[2].split('/');
        let [ month, day ] = dateString;

        const timeArray = testArray[3].split('');
        const hour = timeArray.slice(0, 2).join('');
        const minute = timeArray.slice(2).join('');

        const timerMessage = testArray.slice(4).join(' ');

        const currentMonth = moment().tz('America/Los_Angeles').month() + 1;
        const currentDate = moment().tz('America/Los_Angeles').date();

        month = parseInt(month);
        day = parseInt(day);

        // If month and day are the same as the current date, then omit them from cron calculation
        // this is due to cron setting the current job to next year if it's the current date
        if (month === currentMonth && day === currentDate) {
            month = '*';
            day = '*';
        }

        const cronString = `0 ${minute} ${hour} ${day} ${month} *`;

        switch (modifier) {
            case 'add': {
                new CronJob(cronString, function() {
                    raidChannel.send(timerMessage);

                    this.stop();
                }, null, true, 'America/Los_Angeles');

                break;
            }

            default: {
                message.channel.send('invalid modifier');

                break;
            }
        }

        return message.channel.send('Timer is set!');
    },
}

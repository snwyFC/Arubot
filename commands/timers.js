const cron = require('node-cron');

let raidChannel = 'general';

module.exports = {
    timers: (client) => {
        // Black Dragon 
        // BD Morning Time
        cron.schedule('* 11 * * *', () => {
            console.log(raidChannel);
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Black Dragon is spawning!');
        });

        // BD Evening Time
        cron.schedule('* 19 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Black Dragon is spawning!');
        });

        // -----------------------------

        // White Dragon
        // WD Morning Time
        cron.schedule('30 11 * * *', () => {
            console.log(raidChannel);
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here White Dragon is spawning!');
        });

        // WD Evening Time
        cron.schedule('30 19 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here White Dragon is spawning!');
        });

        // -----------------------------

        // Desert Dragon
        // DD Morning Time
        cron.schedule('30 10 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Desert Dragon is spawning!');
        });

        // DD Evening Time
        cron.schedule('0 17 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Desert Dragon is spawning!');
        });

        // -----------------------------

        // Prairie Dragon
        // PD Morning Time
        cron.schedule('0 15 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Prairie Dragon is spawning!');
        });

        // PD Evening Time
        cron.schedule('0 19 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Prairie Dragon is spawning!');
        });

        // -----------------------------

        // Red Dragon
        // RD Morning Time
        cron.schedule('0 16 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Red Dragon is spawning!');
        });

        // RD Evening Time
        cron.schedule('0 21 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Red Dragon is spawning!');
        });

        // -----------------------------

        // Sandworm
        // Sandworm Morning Time
        cron.schedule('0 10 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Sandworm is spawning!');
        });

        // Sandworm Evening Time
        cron.schedule('0 23 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Sandworm is spawning!');
        });

        // -----------------------------

        // Alligator
        // Alligator Morning Time
        cron.schedule('0 15 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Alligator is spawning!');
        });

        // Alligator Evening Time
        cron.schedule('0 18 * * *', () => {
            const channel = client.channels.find(channel => channel.name === raidChannel);
            channel.send('@here Alligator is spawning!');
        });

        // -----------------------------
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

module.exports = (client) => {
    cron.schedule('*/1 * * * *', () => {
        client.guilds.get(580592413140320286).channels.get(580592413140320288).send('boom');
    });
};
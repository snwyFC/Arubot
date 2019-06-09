module.exports = message => {
    let inpt = message.content; // the message/command issued by the user
    let wiki = inpt.split('!wiki ')[1]; // removes the "!wiki " from the message

    return message.channel.send(`https://wiki.mabi.world/index.php?title=Special:Search&search=${wiki.replace(' ', '+')}`);
};
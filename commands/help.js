const Discord = require('discord.js');

module.exports = (message) => {
    const embed = new Discord.RichEmbed()
	  .setAuthor("Commands") 
	  .setColor(0x8CE8AC)
	  .setTimestamp()

	  .addField('!enchant [text]', 'Searches for the enchant with the provided text and displays results')

    return message.channel.send({embed});
};

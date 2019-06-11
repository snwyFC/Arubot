const Discord = require('discord.js');

module.exports = (message) => {
    const embed = new Discord.RichEmbed()
	  .setAuthor("Commands") 
	  .setColor(0x8CE8AC)
	  .setTimestamp()

	  .addField('!wiki [text]', 'Spits back a search result for Mabinogi World Wiki')
	  .addField('!enchant [text]', 'Searches for the enchant with the provided text and displays results')
	  .addField('!item [text]', 'Searches mabibase for items and returns a mabibase link for items found')
	  .addField('!settimer MM/DD [military time] [message]', 'Adds a message to be played at the specified date and time. Requires elevated privileges.')

    return message.channel.send({embed});
};

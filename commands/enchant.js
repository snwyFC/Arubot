// const fetch = require('node-fetch')
const axios = require('axios')
const fs = require(`fs`)
const Discord = require('discord.js')
const xml2js = require('xml2js');

//  reads a txt file
const readTxt = (file, lineNumber) => {
    let lines = require('fs').readFileSync(file, 'utf-8').split('\n');

    lines.forEach((line) => {
        splitLine = line.split("\t");
        if (splitLine[0] === lineNumber.toString()) {
            return splitLine[1].replace(/(\r\n|\n|\r)/gm, "");
        }
    });
};

//  read skill xml file
const readSkillXML = (text, file) => {
    const parser = new xml2js.Parser();

    return 0;
};

//  translates the information received into plaintext
const translate = (modifiersArray) => {
    let output = '';

    modifiersArray.forEach((modifier) => {
        // if statement to check requirement and then translate it to plaintext
        if (modifier.hasOwnProperty('requirement')){
            let req = `${modifier.requirement}`;

            if (req.includes(`GreaterEqualSkillLv`)){
                temp = req.split(`(`)[1];
                rank = temp.split(`,`)[1];
                splitTemp = temp.split(`,`)[0];
                splitRank = rank.split(`)`)[0];
                txt = readSkillXML(splitTemp);
                output += `When the rank of ${readTxt(`./reference/skillinfo.english.txt`, txt)} is over ${readTxt(`./reference/rank.txt`, splitRank)}`;
            }

            if (req.includes(`LessEqualSkillLv`)){
                temp = req.split(`(`)[1];
                rank = temp.split(`,`)[1];
                splitTemp = temp.split(`,`)[0];
                splitRank = rank.split(`)`)[0];
                txt = readSkillXML(splitTemp);
                output += `When the rank of ${readTxt(`./reference/skillinfo.english.txt`, txt)} is below ${readTxt(`./reference/rank.txt`, splitRank)}`;
            }

            output += `\n`;
        }
    });

    return output;
};

module.exports = async (message) => {
    let inpt = message.content // the message/command issued by the user
    let enchant = inpt.split('!enchant ')[1] // removes the "!enchant " from the message

    // pulls info from mabibase
    const response = await axios.get(`https://api.mabibase.com/enchants/search?q=name,${enchant}&limit=50`);

    let { data } = response.data // rename response.data to data
    let enchantNames = [] // empty array for enchant names
    let enchantRank = [] // empty array for enchant ranks
    let enchantApplies = [] // empty array for what items the enchant can go on
    let enchantType = [] // empty array for whether enchant is prefix or suffix

    // Create RichEmbed
    const embed = new Discord.RichEmbed();
        
    if (data.total > 0 && data.total < 6 ) {
        embed.setAuthor(`Enchant search found ${data.total} result(s) for "${enchant}"`);

        // for loop to create the results string
        for (let i=0; i < data.total; i++) {
            enchantNames.push(data.enchants[i].enchant_name) //adds the enchant name to array
            enchantRank.push(readTxt(`./reference/rank.txt`,data.enchants[i].rank)) // adds the enchant rank to array after converting the rank from the text file
            enchantApplies.push(data.enchants[i].applied_on) // adds to the array for item type allowed
            enchantType.push(data.enchants[i].type) // adds to array for prefix/suffix

            let type = (enchantType[i] === 0) ? `(Prefix)` : `(Suffix)`;

            results = results + `
                __**${enchantNames[i]} (Rank ${enchantRank[i]})**__  ${type}
                Enchant enabled for ${enchantApplies[i]}
            `;

            const modifiers = `${translate(data.enchants[i].modifiers)}`;

            // Filled with strings of modifiers that are not specific 
            const otherModifiers = [];

            // Repair Cost increase
            if (data.enchants[i].repair_modifier > 0) {
                otherModifiers.push(`Repair cost +${data.enchants[i].repair_modifier}%`);
            }

            // Repair Cost decreased
            if (data.enchants[i].repair_modifier < 0) {
                otherModifiers.push(`Repair cost ${data.enchants[i].repair_modifier}%`);
            }

            // Enchant enabled regardless
            if (data.enchants[i].disregard_enchant_rank) {
                otherModifiers.push(`Enchant enabled regardless of rank`);
            }

            embed.addField(`${enchantNames[i]} (Rank ${enchantRank[i]}) ${type}`, `
                Enchant enabled for ${enchantApplies[i]}
                ${modifiers}
                ${otherModifiers.join('\n')}
            `);
        }
        return message.channel.send({embed});

    } else if (data.total > 5) {
        return message.channel.send(`Enchant search for "${enchant}" yielded more than 5 results. Please refine your search and try again.`) // if more than 5 results, try again
    } else {
        return message.channel.send(`No results found for "${enchant}"`) //outputs if no enchant found
    }
}
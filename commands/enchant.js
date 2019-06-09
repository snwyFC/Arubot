// const fetch = require('node-fetch')
const axios = require('axios');
const fs = require(`fs`);
const Discord = require('discord.js');
const xml2js = require('xml2js');

const { days, statNames, conditions, ranks } = require('../reference/map');

const SEARCH_URL = 'https://api.mabibase.com/enchants/search?q=name,';
const SKILL_URL = 'https://api.mabibase.com/name/skill';
const TITLE_URL = 'https://api.mabibase.com/name/title';

const fetchSkillName = async (id) => {
    const { data: { data: skillName } } = await axios.get(`${SKILL_URL}/${id}`);

    return skillName;
};

const fetchTitleName = async (id) => {
    const { data: { data: title } } = await axios.get(`${TITLE_URL}/${id}`);

    return title;
};

//  translates the information received into plaintext
const translate = async (modifiersArray) => {
    let output = '';

    for (const modifier of modifiersArray) {
        // if statement to check requirement and then translate it to plaintext
        if (modifier.hasOwnProperty('requirement')) {
            let req = modifier.requirement;

            // if requirement requires you to have a skill above or equal to specified rank
            if (req.includes(`GreaterEqualSkillLv`)){
                let temp = req.split(`(`)[1];
                let rank = temp.split(`,`)[1];
                let splitTemp = temp.split(`,`)[0];
                let splitRank = rank.split(`)`)[0].trim();

                let skill = await fetchSkillName(splitTemp);

                output += `If ${skill} is Rank ${ranks[splitRank]} or higher `;
            }

            // if requirement requires you to have a skill below or equal to specified rank
            if (req.includes(`LessEqualSkillLv`)){
                let temp = req.split(`(`)[1];
                let rank = temp.split(`,`)[1];
                let splitTemp = temp.split(`,`)[0];
                let splitRank = rank.split(`)`)[0].trim();

                let skill = await fetchSkillName(splitTemp);

                output += `If ${skill} is Rank ${ranks[splitRank]} or lower `;
            }

            // if requirement is to be wearing a title
            if (req.includes(`UsingTitle`)) {
                let temp = req.split(`(`)[1];
                let titleID = temp.split(`)`)[0];

                let title = await fetchTitleName(titleID);

                output += `While holding the ${title} title `
            }

            else if(req.includes('IsInCondition')) {
                let temp = req.split(`(`)[1];
                let conditionID = temp.split(`)`)[0];

                output += `While in the state of ${conditions[conditionID]} `;
            }

            else if(req.includes('IsTodayMonth')) {
                let temp = req.split(`(`)[1];
                let today = temp.split(`)`)[0];

                output += `During ${days[today]} `;
            }

            // if requirement involves levels
            else if (req.includes(`level`)) {
                const lvl = req.split(`=`)[1];

                if (req.includes(`>=`)) {
                    output += `When Level is ${lvl} or higher `
                } 
                if (req.includes(`<=`)) {
                    output += `When Level is ${lvl} or below `
                }
            }
        }

        const effect = modifier.effect;

        switch(effect.function) {
            // Stat increase
            case 'setparamonequip': {
                let [ statName, statNumber ] = effect.arguments;
                let statDiff = (statNumber[0] === '-') ? '' : '+';
                // Strip parens from statNumber if there is any
                statNumber = (statNumber.includes(')')) ?  statNumber.replace(/[()]/g, '') : statNumber;

                output += `${statNames[statName]} ${statDiff}${statNumber}`;
                break;
            }

            case 'setpersonalize': {
                output += '***Personalize***'
                break;
            }

            default: {
                output += `Undefined behavior on **${effect.function}**`
            }
        }

        if(modifiersArray.length !== 1 && modifier !== modifiersArray[modifiersArray.length-1]) {
            output += '\n';
        }
    };
    return output;
};

module.exports = async (message) => {
    let inpt = message.content // the message/command issued by the user
    let enchant = inpt.split('!enchant ')[1] // removes the "!enchant " from the message

    // pulls info from mabibase
    const response = await axios.get(`https://api.mabibase.com/enchants/search?q=name,${enchant}&limit=5`);

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
            enchantRank.push(ranks[data.enchants[i].rank]) // adds the enchant rank to array after converting the rank from the text file
            enchantApplies.push(data.enchants[i].applied_on) // adds to the array for item type allowed
            enchantType.push(data.enchants[i].type) // adds to array for prefix/suffix

            let type = (enchantType[i] === 0) ? `(Prefix)` : `(Suffix)`;

            const modifiers = await translate(data.enchants[i].modifiers);

            // Filled with strings of modifiers that are not specific 
            const otherModifiers = [];

            // Repair Cost increase
            if (data.enchants[i].repair_modifier > 0) {
                otherModifiers.push(`+${data.enchants[i].repair_modifier}% Repair Cost`);
            }

            // Repair Cost decreased
            if (data.enchants[i].repair_modifier < 0) {
                otherModifiers.push(`${data.enchants[i].repair_modifier}% Repair Cost`);
            }

            // Enchant enabled regardless
            if (data.enchants[i].disregard_enchant_rank) {
                otherModifiers.push(`Enchant enabled regardless of rank`);
            }

            const otherModifiersText = (otherModifiers.length === 0) ? '' : otherModifiers.join('\n') + '\n';

            embed.addField(`${enchantNames[i]} (Rank ${enchantRank[i]}) ${type}`, `
                    Enchant enabled for ${enchantApplies[i]}
                    ${modifiers} 
                ` + 
                `${otherModifiersText}` +
                `${(i+1 !== data.total) ? '\u200B' : ''}`
            );

        }
        return message.channel.send({embed});

    } else if (data.total > 5) {
        return message.channel.send(`Enchant search for "${enchant}" yielded more than 5 results. Please refine your search and try again.`) // if more than 5 results, try again
    } else {
        return message.channel.send(`No results found for "${enchant}"`) //outputs if no enchant found
    }
}

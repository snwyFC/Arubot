// const fetch = require('node-fetch')
const axios = require('axios')
const fs = require(`fs`)
const Discord = require('discord.js')

//  reads a txt file
function readTxt(file, lineNumber){
    var value = [];

    var lines = require('fs').readFileSync(file, 'utf-8')
    .split('\n');

    for (i = 0; i < lines.length; i++) {
        splitLine = lines[i].split("\t");
        if (splitLine[0] === lineNumber.toString()) {
            return splitLine[1].replace(/(\r\n|\n|\r)/gm, "");
        }
    }
}

//  read skill xml file
function readSkillXML(text, file) {
    xml2js = require(`xml2js`)
    parser = new xml2js.Parser();
    return 0;
}

//  translates the information received into plaintext
function translate(modifiersArray){
    output = ''
    for (let i = 0; i < modifiersArray.length; i++){
        // if statement to check requirement and then translate it to plaintext
        if (modifiersArray[i].hasOwnProperty('requirement')){
            let req = `${modifiersArray[i].requirement}`
            if (req.includes(`GreaterEqualSkillLv`)){
                temp = req.split(`(`)[1]
                rank = temp.split(`,`)[1]
                splitTemp = temp.split(`,`)[0]
                splitRank = rank.split(`)`)[0]
                txt = readSkillXML(splitTemp)
                output = output + `When the rank of ${readTxt(`./reference/skillinfo.english.txt`, txt)} is over ${readTxt(`./reference/rank.txt`, splitRank)} `
            }
            if (req.includes(`LessEqualSkillLv`)){
                temp = req.split(`(`)[1]
                rank = temp.split(`,`)[1]
                splitTemp = temp.split(`,`)[0]
                splitRank = rank.split(`)`)[0]
                txt = readSkillXML(splitTemp)
                output = output + `When the rank of ${readTxt(`./reference/skillinfo.english.txt`, txt)} is below ${readTxt(`./reference/rank.txt`, splitRank)} `
            }
            if (i+1 != modifiersArray.length) {
                output = output + `\n`;
            }
        }
        
        
    }

    return output;
}

module.exports = message => {

    inpt = message.content // the message/command issued by the user
    enchant = inpt.split('!enchant ')[1] // removes the "!enchant " from the message
    
    axios
    .get(`https://api.mabibase.com/enchants/search?q=name,${enchant}&limit=50`) // pulls info from mabibase
    .then(response => {
        let { data } = response.data // rename response.data to data
        let enchantNames = [] // empty array for enchant names
        let enchantRank = [] // empty array for enchant ranks
        let enchantApplies = [] // empty array for what items the enchant can go on
        let enchantType = [] // empty array for whether enchant is prefix or suffix

        const embed = new Discord.RichEmbed();
        
        if (data.total > 0 && data.total < 6 ) {
            // create results string to output
            results = `
Enchant search found ${data.total} result(s) for "${enchant}"`
            embed.setAuthor(results);
            // for loop to create the results string
            for (let i=0; i < data.total; i++) {
                enchantNames.push(data.enchants[i].enchant_name) //adds the enchant name to array
                enchantRank.push(readTxt(`./reference/rank.txt`,data.enchants[i].rank)) // adds the enchant rank to array after converting the rank from the text file
                enchantApplies.push(data.enchants[i].applied_on) // adds to the array for item type allowed
                enchantType.push(data.enchants[i].type) // adds to array for prefix/suffix
                type = ''
                if (enchantType[i] === 0){
                    type = `(Prefix)`
                } else {
                    type = `(Suffix)`
                }

                results = results + `
__**${enchantNames[i]} (Rank ${enchantRank[i]})**__  ${type}
Enchant enabled for ${enchantApplies[i]}
`
                 //for loop to append modifiers to results
                //  for (let j=0; j < data.enchants[i].modifiers.length; j++){
                     // check modifier arguments
                     // check to see if requirement and append to result if true
//                      if (data.enchants[i].modifiers[j].requirement){
//                          results = results +`If ${data.enchants[i].modifiers[j].requirement}
//  `
//                      }
//                      let modifierArguments = []
//                      let modArgs = `` // string for the modifier arguments
//                      for (let k=0; k < data.enchants[i].modifiers[j].effect.arguments.length; k++){
//                          modifierArguments.push(data.enchants[i].modifiers[j].effect.arguments[k]) // add modifier lines to array
//                           modArgs = modArgs + `${modifierArguments[k]} `
//                       }
//                     // append to results
//                      results = results + `${modArgs}
// `
                    const modifiers = `${translate(data.enchants[i].modifiers)}`;
//                    results = results +`${translate(data.enchants[i].modifiers)}\n`
                    //  } // end for loop to append modifiers to results 

                    const otherModifiers = [];
                    if (data.enchants[i].repair_modifier > 0) {
                        // results = results + `Repair cost +${data.enchants[i].repair_modifier}%\n`
                        otherModifiers.push(`Repair cost +${data.enchants[i].repair_modifier}%`);
                    } // check to see if repair cost is increased

                    if (data.enchants[i].repair_modifier < 0) {
                        // results = results + `Repair cost ${data.enchants[i].repair_modifier}%\n`
                        otherModifiers.push(`Repair cost ${data.enchants[i].repair_modifier}%`);
                    } // check to see if repair cost is decreased

                    if (data.enchants[i].disregard_enchant_rank) {
                        // results = results + `Enchant enabled regardless of rank\n`
                        otherModifiers.push(`Enchant enabled regardless of rank`);
                    } // check to see if enchant enabled rank regardless

                    embed.addField(`${enchantNames[i]} (Rank ${enchantRank[i]}) ${type}`, `
                    Enchant enabled for ${enchantApplies[i]}
                    ${modifiers}
                    ${otherModifiers.join('\n')}
                    `)
                } // end for loop to create Results string
            // return message.channel.send(results)
            return message.channel.send({embed});
        } else if (data.total > 5) {
            return message.channel.send(`Enchant search for "${enchant}" yielded more than 5 results. Please refine your search and try again.`) // if more than 5 results, try again
        } else return message.channel.send(`No results found for "${enchant}"`) //outputs if no enchant found


    })
    .catch(err => console.log(err))

}
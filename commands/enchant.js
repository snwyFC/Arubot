// const fetch = require('node-fetch')
const axios = require('axios')

//function to change ranks to in game values
function realRank(rank) {
    if (rank === 18) return 'Dan 3'
    if (rank === 17) return 'Dan 2'
    if (rank === 16) return 'Dan 1'
    if (rank === 15) return '1'
    if (rank === 14) return '2'
    if (rank === 13) return '3'
    if (rank === 12) return '4'
    if (rank === 11) return '5'
    if (rank === 10) return '6'
    if (rank === 9) return '7'
    if (rank === 8) return '8'
    if (rank === 7) return '9'
    if (rank === 6) return 'A'
    if (rank === 5) return 'B'
    if (rank === 4) return 'C'
    if (rank === 3) return 'D'
    if (rank === 2) return 'E'
    if (rank === 1) return 'F'
}

module.exports = message => {

    inpt = message.content // the message/command issued by the user
    enchant = inpt.split('!enchant ')[1] // removes the "!enchant " from the message
    
    axios
    .get(`https://api.mabibase.com/enchants/search?q=name,${enchant}`) // pulls info from mabibase
    .then(response => {
        let { data } = response.data // rename response.data to data
        let enchantNames = [] // empty array for enchant names
        let enchantRank = [] // empty array for enchant ranks
        let enchantApplies = [] // empty array for what items the enchant can go on
        let enchantType = [] // empty array for whether enchant is prefix or suffix

        if (data.total > 0) {
            // create results string to output
            results = `
Enchant search found ${data.total} results for "${enchant}"`
            // for loop to create the results string
            for (let i=0; i < data.total; i++) {
                enchantNames.push(data.enchants[i].enchant_name) //adds the enchant name to array
                enchantRank.push(realRank(data.enchants[i].rank)) // adds the enchant rank to array after running it through the above function
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
                 for (let j=0; j < data.enchants[i].modifiers.length; j++){
                     // check modifier arguments
                     // check to see if requirement and append to result if true
                     if (data.enchants[i].modifiers[j].requirement){
                         results = results +`If ${data.enchants[i].modifiers[j].requirement}
 `
                     }
                     let modifierArguments = []
                     let modArgs = `` // string for the modifier arguments
                     for (let k=0; k < data.enchants[i].modifiers[j].effect.arguments.length; k++){
                         modifierArguments.push(data.enchants[i].modifiers[j].effect.arguments[k]) // add modifier lines to array
                          modArgs = modArgs + `${modifierArguments[k]} `
                      }
                    // append to results
                     results = results + `${modArgs}
`
                     } // end for loop to append modifiers to results 

                    if (data.enchants[i].repair_modifier > 0) {
                        results = results + `Repair cost +${data.enchants[i].repair_modifier}%
`
                    } // check to see if repair cost is increased
                    if (data.enchants[i].repair_modifier <0) {
                        results = results + `Repair cost ${data.enchants[i].repair_modifier}%
`
                    } // check to see if repair cost is decreased
                    if (data.enchants[i].disregard_enchant_rank) {
                        results = results + `Enchant enabled regardless of rank
`
                    } // check to see if enchant enabled rank regardless
                } // end for loop to create Results string
            return message.reply(results)
        } else return message.reply(`No results found for "$enchant"`) //outputs if no enchant found


    })
    .catch(err => console.log(err))

}
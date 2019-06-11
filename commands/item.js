const axios = require('axios');

const SEARCH_URL = 'https://api.mabibase.com/items/search/name/';
const ITEM_URL = 'https://mabibase.com/item/';

module.exports = async (message) => {
    console.log(message.content)
    let inpt = message.content // the message/command issued by the user
    let item = inpt.split('!item ')[1] // removes the "!item " from the message

    // pulls info from mabibase
    const response = await axios.get(`${SEARCH_URL}${item}?limit=10`);

    let { data } = response.data; // rename response.data to data
    let itemID = []; // empty array for itemIDs

    if (data.total > 5) {
        return message.channel.send('Item search yielded more than 5 results. Please refine your search and try again.'); // if more than 5 results, try again
    } else if (data.total > 0 && data.total < 6) {
        let result = '';
        result += `Item search found ${data.total} result(s) for "${item}"\n`
        // add itemIDs to array, append to result
        for (let i = 0; i < data.total; i++) {
            itemID.push(data.items[i].id);
            result += `${ITEM_URL}${itemID[i]}\n`;
        }
        return message.channel.send(result); // returns result
    } else {
        return message.channel.send(`No results found for "${item}"`) //output if no items found
    }

}
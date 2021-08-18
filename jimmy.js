const cheerio = require('cheerio');
const got = require('got');

const vgmUrl= 'https://www.jimmybet.com.au/Sport/Australian_Rules/AFL/Matches';
// https://www.jimmybet.com.au/Sport/Baseball/Major_League_Baseball/Matches

(async () => {
    const response = await got(vgmUrl);
    const $ = cheerio.load(response.body);

    var events = $('.framePanel')
    var len = events.length
    for (var x=0; x<len; x++) {
        var tbody = $(events[x]).find('tbody')
        console.log(tbody)
    }
})()
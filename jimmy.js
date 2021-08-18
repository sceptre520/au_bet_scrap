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
        var thead = $(events[x]).find('thead')
        var tds = $(thead).find('td')
        var market_len = tds.length
        var markets = []
        for(var y=0; y<market_len; y++) {
            markets.push($(tds)[y].text)
        }
        console.log(markets)
        var tbody = $(events[x]).find('tbody')
        var outcomes = $(tbody).children('tr')
        var out_len = outcomes.length
        for(var y=0; y<out_len; y++) {
            var tmp = {
                team_name: $(outcomes[y]).children('th').children('div').last().text
            }
            var odds = $(outcomes[y]).children('td')
            for(var z=0; z<market_len; z++) {
                tmp[markets[z]] = $(odds[z]).children('a').text
            }
            console.log(tmp)
        }
        console.log('------------   tbody   ---------------')
    }
})()
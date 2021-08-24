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
        var match_time = $(thead).find('th').children('span').text()
        var tds = $(thead).find('td')
        var markets = []
        var market_len = tds.length
        var indexes = []
        for(var y=0; y<market_len; y++) {
            var market_name = $(tds[y]).text()
            var tmp_len = markets.length
            var flag = -1
            for(var z=0; z<tmp_len; z++) {
                if(markets[z].key == market_name) {
                    indexes.push(z)
                    flag = 1
                    break
                }
            }
            if(flag == -1) {
                markets.push({
                    key: market_name,
                    outcomes: []
                })
                indexes.push(markets.length-1)
            }
        }
        var tbody = $(events[x]).find('tbody')
        var outcomes = $(tbody).children('tr')
        var out_len = outcomes.length
        var team_names = []
        for(var y=0; y<out_len; y++) {
            var odds = $(outcomes[y]).children('td')
            var team_name = $(outcomes[y]).children('th').children('div').last().text()
            team_names.push(team_name)
            for(var z=0; z<market_len; z++) {
                var tmp_str = $(odds[z]).children('a').text()
                var tmp_arr = tmp_str.split('@')
                tmp_str = tmp_arr[tmp_arr.length-1]
                tmp_str = tmp_str.trim()
                
                markets[indexes[z]].outcomes.push({
                    name: team_name,
                    price: tmp_str
                })
            }
        }
        console.log(team_names)
        console.log(match_time)
        console.log(JSON.stringify(markets))
        console.log('------------   tbody   ---------------')
    }
})()
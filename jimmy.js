const cheerio = require('cheerio');
const got = require('got');

// const vgmUrl= 'https://www.jimmybet.com.au/Sport/Australian_Rules/AFL/Matches';
// const vgmUrl= 'https://www.jimmybet.com.au/Sport/Baseball/Major_League_Baseball/Matches'
const vgmUrl= 'https://www.jimmybet.com.au/Sport/Soccer/American_Major_League_Soccer/Matches'


const getData = async (pmUrl) => {
    const response = await got(pmUrl);
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
        var draw_flag = -1
        for(var y=0; y<market_len; y++) {
            var market_name = $(tds[y]).text()
            var tmp_len = markets.length
            var flag = -1
            var mk_key = convertMarketName(market_name)
            for(var z=0; z<tmp_len; z++) {
                if(markets[z].key == mk_key) {
                    indexes.push(z)
                    flag = 1
                    break
                }
            }
            if(flag == -1) {
                markets.push({
                    key: mk_key,
                    outcomes: []
                })
                indexes.push(markets.length-1)
                if(mk_key == 'draw') {
                    draw_flag = markets.length-1
                }
            }
        }
        var tbody = $(events[x]).find('tbody')
        var outcomes = $(tbody).children('tr')
        var out_len = outcomes.length
        var team_names = []
        var draw_val = 0
        for(var y=0; y<out_len; y++) {
            var odds = $(outcomes[y]).children('td')
            var team_name = $(outcomes[y]).children('th').children('div').last().text()
            team_names.push(team_name)
            for(var z=0; z<market_len; z++) {
                var tmp_str = $(odds[z]).children('a').text()
                var tmp_arr = tmp_str.split('@')
                tmp_str = tmp_arr[tmp_arr.length-1]
                tmp_str = tmp_str.trim()
                if(draw_flag != -1 && y==0 && z==draw_flag) draw_val = tmp_str
                if(draw_flag != -1 && y!=0 && z==draw_flag) {
                    markets[indexes[z]].outcomes.push({
                        name: team_name,
                        price: draw_val
                    })
                }
                if(draw_flag != -1 && y!=0 && z>=draw_flag) {
                    if (z < market_len-1)
                        markets[indexes[z]+1].outcomes.push({
                            name: team_name,
                            price: tmp_str
                        })
                    continue
                }
                markets[indexes[z]].outcomes.push({
                    name: team_name,
                    price: tmp_str
                })
            }
        }
        console.log(team_names)
        console.log(convertTimeFormat(match_time))
        console.log(JSON.stringify(markets))
        console.log('------------   tbody   ---------------')
    }
}

function convertTimeFormat(pm_str) {
    var tmp_arr = pm_str.split('@')
    var dt_arr = tmp_arr[0].split(' ')
    var tm_str = tmp_arr[1].trim()
    var months = {
        'January':'01',
        'February':'02',
        'March':'03',
        'April':'04',
        'May':'05',
        'June':'06',
        'July':'07',
        'August':'08',
        'September':'09',
        'October':'10',
        'November':'11',
        'December':'12'
    };
    return dt_arr[3] + '-' + months[dt_arr[2]] + '-' + dt_arr[1] + 'T' + tm_str + ':00Z'
}

function convertMarketName(pm_name) {
    var dict = {
        'Win' : 'h2h',
        'Line' : 'spreads',
        'Draw' : 'draw',
        'O/U' : 'totals',
    }
    if (dict[pm_name])
        return dict[pm_name]
    else
        return pm_name
}

getData(vgmUrl)
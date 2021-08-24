const cheerio = require('cheerio');
const got = require('got');

const vgmObjs= [
    {
        sport_key:'aussierules_afl',
        sport_title:'AFL',
        markets:[
            {
                key:'h2h',
                url:'https://www.tabtouch.com.au/sports/australian-rules/afl/30929/1042715?tourname=Matches&tourseq=2800490&groupid=100&groupcode=--&groupname=Head-to-Head'
            },
            {
                key:'spread',
                url:'https://www.tabtouch.com.au/sports/australian-rules/afl/30929/1042715?tourname=Matches&tourseq=2800490&groupid=145&groupcode=--&groupname=Line'
            }
        ]
    },
    {
        sport_key:'baseball_mlb',
        sport_title:'MLB',
        markets:[
            {
                key:'h2h',
                url:'https://www.tabtouch.com.au/sports/baseball/mlb/30933/1042721?tourname=Matches&tourseq=2806702&groupid=110&groupcode=--&groupname=Match-Result'
            },
            {
                key:'spread',
                url:'https://www.tabtouch.com.au/sports/baseball/mlb/30933/1042721?tourname=Matches&tourseq=2806702&groupid=10000&groupname=Handicap-Betting'
            },
            {
                key:'totals',
                url:'https://www.tabtouch.com.au/sports/baseball/mlb/30933/1042721?tourname=Matches&tourseq=2806702&groupid=10000&groupname=Total-Runs'
            }
        ]
    }
]

const getData = async (pmObj) => {
    markets = {}
    var mk_len = pmObj.markets.length
    for(var mk_i=0; mk_i<mk_len; mk_i++) {
        const response = await got(pmObj.markets[mk_i].url);
        const $ = cheerio.load(response.body);

        var mainDiv = $('#propResult')
        var tbody = $(mainDiv).children('table').children('tbody')
        var trs = $(tbody).children('tr')
        var tr_len = trs.length
        var tpm_i=0;
        while(tpm_i<tr_len) {
            var matchname = $(trs[tpm_i]).children('td').children('strong').text()
            tpm_i ++;
            var teams = []
            var odds = []
            var mkt_id = ''
            var outcomes = []
            while(tpm_i<tr_len && $(trs[tpm_i]).children('td').attr('colspan') == undefined) {
                var team_name = $(trs[tpm_i]).children('td').first().next().text()
                var odd_val = $(trs[tpm_i]).children('td').last().children('a').children('span').text()
                teams.push(team_name)
                odds.push(odd_val)
                mkt_id += team_name.trim()
                tpm_i ++
                outcomes.push({
                    name: team_name,
                    price: odd_val
                })
            }
            console.log(matchname)
            console.log(teams)
            console.log(odds)
            if (markets[mkt_id] == null) markets[mkt_id] = []
            markets[mkt_id].push({
                key: pmObj.markets[mk_i].key,
                outcomes: outcomes
            })
        }
    }
    console.log(markets)
}

var tmp_len = vgmObjs.length
for(var tmp_i=0; tmp_i<tmp_len; tmp_i++) {
    getData(vgmObjs[tmp_i])
}
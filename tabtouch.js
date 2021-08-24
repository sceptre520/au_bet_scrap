const cheerio = require('cheerio');
const got = require('got');


const getData = async () => {
    const response = await got('https://www.tabtouch.com.au/sports/australian-rules/afl/30929/1042715?tourname=Matches&tourseq=2800490&groupid=100&groupcode=--&groupname=Head-to-Head');
    const $ = cheerio.load(response.body);

    var mainDiv = $('#propResult')
    var tbody = $(mainDiv).children('table').children('tbody')
    var trs = $(tbody).children('tr')
    var tr_len = trs.length
    for(var tpm_i=0; tpm_i<tr_len; tpm_i+=3) {
        var matchname = $(trs[tpm_i]).children('td').children('strong').text()
        var team_1 = $(trs[tpm_i+1]).children('td').first().next().text()
        var odd_1 = $(trs[tpm_i+1]).children('td').last().children('a').children('span').text()
        var team_2 = $(trs[tpm_i+2]).children('td').first().next().text()
        var odd_2 = $(trs[tpm_i+2]).children('td').last().children('a').children('span').text()
        console.log(matchname)
        console.log(team_1+' - '+odd_1+' : '+team_2+' - '+odd_2)
    }
}


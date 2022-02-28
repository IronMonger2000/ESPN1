const request = require('request');
const cheerio = require("cheerio");
const scorecardObj = require('./scorecard')
function getAllMatchLink(url2) {
    request(url2, function (error, response, html) {
        if (error)
            console.log(error);
        else
            extraxtAllLink(html);
    })
}

function extraxtAllLink(html) {
    let selTool = cheerio.load(html);
    let scorecardAdd = selTool('a[data-hover="Scorecard"]');
    for (let i = 0; i < scorecardAdd.length; i++) {
        let link = selTool(scorecardAdd[i]).attr('href')
        let fullLink = "https://www.espncricinfo.com" + link;
        // console.log(fullLink);
        scorecardObj.processThisLink(fullLink);
    }
}


module.exports = {
    getAllMatch: getAllMatchLink
}
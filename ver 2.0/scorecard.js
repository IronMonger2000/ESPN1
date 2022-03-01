// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request = require('request')
const cheerio = require('cheerio');
const path = require("path")
const fs = require("fs")
const xlsx = require('xlsx')
const { contains } = require('cheerio');
function processScorecardUrl(url) {
    request(url, cb);
}
function cb(error, respose, html) {
    if (error)
        console.log(error);
    else
        extractLink(html);
}

function extractLink(html) {
    let selTool = cheerio.load(html);
    let desc = selTool('.header-info .description').text();
    let descStrToArr = desc.split(",");
    let venue = descStrToArr[1].trim();
    let date = descStrToArr[2].trim();
    let result = selTool('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text').text();
    console.log(venue);
    console.log(date);
    console.log(result);

    let htmlString = "";
    let innings = selTool('.card.content-block.match-scorecard-table>.Collapsible');
    for (let i = 0; i < innings.length; i++) {
        // let teamname = selTool(innings[i]).find('.Collapsible .header-title.label').text().split('INNINGS');
        // console.log(teamname[0]);
        //or
        let teamname = selTool(innings[i]).find('h5').text().split('INNINGS')[0].trim();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = selTool(innings[opponentIndex]).find('h5').text().split('INNINGS')[0].trim();
        console.log(teamname, opponentName);

        let CInning = selTool(innings[i])
        let allRows = CInning.find('table.batsman tbody tr');

        for (let j = 0; j < allRows.length; j++) {
            let allCols = selTool(allRows[j]).find('td');
            let isBatsman = selTool(allCols[0]).hasClass('batsman-cell');
            if (isBatsman == true) {
                let batsManName = selTool(allCols[0]).text().trim();
                let runs = selTool(allCols[2]).text().trim();
                let balls = selTool(allCols[3]).text().trim();
                let fours = selTool(allCols[5]).text().trim();
                let sixes = selTool(allCols[6]).text().trim();
                let StrikeRate = selTool(allCols[7]).text().trim();
                console.log(` ${batsManName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${StrikeRate}`);
                processPlayer(teamname, opponentName, batsManName, runs, balls, fours, sixes, StrikeRate, venue, date, result)
            }
        }
    }
    console.log(`NEXT MATCH NEXT MATCH NEXT MATCH NEXT MATCH NEXT MATCH NEXT MATCH NEXT MATCH NEXT MATCH`)
    // console.log(htmlString);
}

function dirCreator(folderpath) {
    if (fs.existsSync(folderpath) == false) {
        fs.mkdirSync(folderpath)
    }
}

function processPlayer(teamname, opponentName, batsManName, runs, balls, fours, sixes, StrikeRate, venue, date, result) {
    let teampath = path.join(__dirname, "IPL", teamname)
    dirCreator(teampath);

    let filepath = path.join(teampath, batsManName + '.xlsx');
    let content = excelReader(filepath, batsManName);
    let playerObj = {
        batsManName, teamname, opponentName, runs, balls, fours, sixes, StrikeRate, venue, date, result
    };
    content.push(playerObj);
    excelWriter(filepath, batsManName, content);
}
function excelWriter(fileName, sheetName, jsonData) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, fileName);
}

function excelReader(fileName, sheetName) {
    if (fs.existsSync(fileName) == false)
        return []
    let wb = xlsx.readFile(fileName);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
module.exports = {
    processThisLink: processScorecardUrl
}


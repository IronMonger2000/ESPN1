const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const allMatchobj = require('./allMatch')
const request = require('request');
const cheerio = require("cheerio");
const fs = require("fs")
const path = require("path")

let iplPath = path.join(__dirname, "IPL");
//__dirname gives the path of parent directory.
dirCreator(iplPath);

request(url, function (error, response, html) {
    if (error)
        console.log(error)
    else
        extractLink(html);
})

function extractLink(html) {
    let selTool = cheerio.load(html);
    let anchorTag = selTool('a[data-hover="View All Results"]')
    let link = anchorTag.attr('href');
    console.log(link);
    let fullLink = "https://www.espncricinfo.com" + link;
    console.log(fullLink);
    allMatchobj.getAllMatch(fullLink);
}

function dirCreator(folderpath) {
    if (fs.existsSync(folderpath) == false) {
        fs.mkdirSync(folderpath)
    }
}


function excelWriter(fileName, sheetName, jsonData) {
    let newWB = x1sx.utils.book_new();
    let newWS = x1sx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xIsx.writeFile(newWB, fileName);
}

function excelReader(fileName) {
    let wb = x1sx.readFile(fileName);
    let excelData = wb.Sheets[sheetName];
    let ans = x1sx.utils.sheet_to_json(excelData);
    console.log(ans)
}
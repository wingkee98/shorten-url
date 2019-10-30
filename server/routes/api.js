var express = require('express');
var router = express.Router();
var fs = require('fs');

var dataFile = require('../../dataFile.json');

router.get('/', (req, res, next) => {
    res.send(dataFile);
});

router.post('/', (req, res, next) => {
    let inputUrl = req.body.url.toLowerCase();

    if (!dataFile.url) dataFile.url = [];

    dataFile.url.push(inputUrl);
    saveDataFile();

    res.send({ shortUrl: genShortenUrl(req), longUrl: req.body.url });
});

function saveDataFile() {
    console.log('ready to save data file ' + JSON.stringify(dataFile));

    fs.writeFile('./dataFile.json', JSON.stringify(dataFile), (err) => {
        if (err) {
            console.err('Write ERROR ' + err);
            throw err;
        }

        console.log('save data file successfully');
    });
}

function genShortenUrl(req) {
    return req.get('host') + '/' + dataFile.url.length;
}

module.exports = router;
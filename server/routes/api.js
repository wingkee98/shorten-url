var express = require('express');
var router = express.Router();
var urlModel = require('../models/url');
var fs = require('fs');

var dataFile = require('../../dataFile.json');

router.get('/', (req, res, next) => {
    res.send(dataFile);
});

router.post('/', (req, res, next) => {
    let result = { isInputLongUrl: true };

    console.log('input url ' + JSON.stringify(req.body));

    if (isLongUrl(req)) {
        let shortenUrl = genShortenUrl(req);
        result.shortUrl = shortenUrl;
    } else {
        result.isInputLongUrl = false;
        result.longUrl = getLongUrl(req);
    }

    res.send(result);
});

function saveDataFile() {
    console.log('ready to save data file ' + JSON.stringify(dataFile));

    // fs.writeFile('./dataFile.json', JSON.stringify(dataFile), (err) => {
    //     if (err) {
    //         console.err('Write ERROR ' + err);
    //         throw err;
    //     }

    //     console.log('save data file successfully');
    // });

    
}

function isLongUrl(req) {
    let url = req.body.url.toLowerCase();
    let host = req.get('host').toLowerCase();

    return url.indexOf(host) >= 0 ? false : true;
}

function genShortenUrl(req) {
    if (!dataFile.lastIndex) {
        dataFile.lastIndex = 0;
        dataFile.longUrl = {};
        dataFile.shortUrl = {};
    };

    let inputUrl = req.body.url.toLowerCase();
    let shortUrl = '';
    if (!dataFile.longUrl[inputUrl]) {
        dataFile.lastIndex++;
        shortUrl = req.get('host') + '/' + dataFile.lastIndex;

        dataFile.longUrl[inputUrl] = shortUrl;
        dataFile.shortUrl[shortUrl] = inputUrl;

        saveDataFile();
    } else {
        shortUrl = dataFile.longUrl[inputUrl];
    }

    console.log('Full URL ' + req.protocol + '://' + req.get('host') + ' org ' +req.originalUrl);
    return shortUrl;
}

function getLongUrl(req) {
    let url = req.body.url.toLowerCase();

    return dataFile.shortUrl[url];
}

module.exports = router;
var express = require('express');
var router = express.Router();
var fs = require('fs');

var dataFile = require('../../dataFile.json');

router.get('/:id', (req, res, next) => {
    dataFile = require('../../dataFile.json');

    let shortUrl = req.get('host') + '/' + req.params.id;
    let longUrl = makeFullUrl(getLongUrl(shortUrl));

    console.log('param id ' + req.params.id);

    //res.send(longUrl);
    res.redirect(longUrl);
});

function getLongUrl(url) {
    return dataFile.shortUrl[url];
}

function makeFullUrl(url) {
    let pattern = /^((http|https):\/\/)/;
    let newUrl = url;

    if (!pattern.test(url)) {
      newUrl = 'http://' + url;
    }

    return newUrl;
}

module.exports = router;
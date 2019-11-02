var express = require('express');
var router = express.Router();

module.exports = (dbCollection, index) => {
    router.get('/:id', (req, res, next) => {

        const shortUrl = req.get('host') + '/' + req.params.id;

        console.log('find url ' + shortUrl);
        
        dbCollection.findOne({ shortUrl: shortUrl }, (err, doc) => {
            if (err) {
                console.log('cannot find url ' + shortUrl);
                res.status(404).json({ message: 'connot find url ' + shortUrl + ' : ' + err });
            } else {
                const longUrl = makeFullUrl(doc.longUrl);
                console.log('found url ' + shortUrl + ' : ' + longUrl );
                res.redirect(longUrl);
            }
        });
    });

    function makeFullUrl(url) {
        let pattern = /^((http|https):\/\/)/;
        let newUrl = url;

        if (!pattern.test(url)) {
        newUrl = 'http://' + url;
        }

        return newUrl;
    }

    return router;
}
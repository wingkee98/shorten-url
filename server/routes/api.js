var express = require('express');
var router = express.Router();
//var UrlModel = require('../models/url');
//const urlMongodb = require('mongodb').MongoClient;
var urlIndex = undefined;

module.exports = function(dbCollection, index) {
    urlIndex = index;
    console.log('index passed in ' + index);

    router.get('/', async (req, res, next) => {
        // console.log('get url now');
        // try {
        //     console.log('get db now')
        //     const urlModel = await UrlModel.find();
        //     console.log('get url ' + JSON.stringify(urlModel));
        //     res.json(urlModel);
        // }
        // catch (err) {
        //     console.log('get url failed ' + err);
        //     res.status(500).json({ message: 'get url failed ' + err });
        // }
        dbCollection.find().toArray((err, docs) => {
            if (err) {
                res.status(404).json({ message: "cannot find index "});
                console.log('Cannot find index');
            } else {
                console.log('got it ' + docs);
                res.json({ message: docs});
            }
        });
    });

    router.post('/', (req, res) => {
        const longUrl = req.body.url;
        const shortUrl = req.get('host') + "/" + urlIndex++;

        dbCollection.insert({ 
            longUrl: longUrl,
            shortUrl: shortUrl
        }, (err, result) => {
            if (err) {
                console.log('insert failed ' + err);
                res.status(404).json({ message: 'inser failed ' + err});
            } else {
                console.log('inserted to db ' + result);
                saveIndex();
                res.json({ longUrl: longUrl, shortUrl: shortUrl });
            }
        });
    });

    function saveIndex() {
        dbCollection.update({ longUrl: 'index' }, 
        { $set: { index: urlIndex }},
        ( err, result ) => {
            console.log('save indexed');
        });
    }
    // router.post('/', (req, res, next) => {
    //     const url = req.body.url.toLowerCase();
    //     const urlModel = new UrlModel({
    //         longUrl: url,
    //         shortUrl: req.get('host') + '/' + urlIndex++
    //     });
    //         urlModel.save()
    //         .then((resp) => {
    //             console.log('save url ' + url);
    //             setIndex();
    //             let result = { isInputLongUrl: true, longUrl: url, shortUrl: urlModel.shortUrl };
    //             console.log('input url ' + JSON.stringify(req.body));
    //             res.send(result);
    //         })
    //         .catch(err => {
    //             console.log('save url failed ' + err);
    //             let result = { isInputLongUrl: true, longUrl: url, shortUrl: urlModel.shortUrl };
    //             console.log('input url ' + JSON.stringify(req.body));
    //             res.send(result);
    //         });
    // });

    return router;
}

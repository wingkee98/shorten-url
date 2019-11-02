var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongodb');
var mongodbClient = require('mongodb').MongoClient;
require('dotenv/config');

var apiRoute = require('./server/routes/api');
var redirectRoute = require('./server/routes/redirect');

var port = process.env.PORT || '9000';
var app = express();

//set static folder
app.use(express.static(path.join(__dirname, 'dist/shorten-url')));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// // connect to DB
// mongoose.connect(
//     process.env.DB_CONNECTION,
//     { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('connected to DB');
//     })
//     .catch((err) => {
//         console.log('connected to DB failed ' + err);
//     });
const dbCollection;
mongodbClient.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
        if (err) {
            console.log('connect to db failed ' + err);
        } else {
            console.log('connected to db');
            dbCollection = client.db('shorten-url').collection('url');

            // get index
            dbCollection.findOne({longUrl: 'index'}, (err, doc) => {
                if (err) {
                    console.log('failed to get index value ' + err);
                } else if (!doc || !doc.index) {
                    console.log('index value is 0');
                    setupRouteMiddleware(dbCollection, 0);
                } else 
                {
                    console.log('got index value ' + doc.index);
                    setupRouteMiddleware(dbCollection, doc.index);
                }
            });
        }
    });

// set server
app.set('port', port);;

var server = http.createServer(app);
server.listen(port, () => {
    console.log('Server is ready on port ' + port + ' path ' + __dirname);
});

function setupRouteMiddleware(dbCollection, index) {
    // router path middleware
    app.use('/api', apiRoute(dbCollection, index));
    app.use('/', redirectRoute(dbCollection, index));
    app.use('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/shorten-url/index.html'));
    });
}
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');

var api = require('./server/routes/api');

var port = process.env.PORT || '9000';
var app = express();

//set static folder
app.use(express.static(path.join(__dirname, 'dist/shorten-url')));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// router path
app.use('/', api);
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/shorten-url/index.html'));
});

// set server
app.set('port', port);

var server = http.createServer(app);
server.listen(port, () => {
    console.log('Server is ready on port ' + port + ' path ' + __dirname);
});

var express = require('express');
var app = express();
var path = require('path');

app.use( '/static', express.static('static') );
app.use( '/images', express.static('images') );
app.get( '/', function (req, res) {
    res.sendFile( path.join( __dirname + '/index.html' ) );
} );

var server = app.listen( 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening %s:%s', host, port);
});

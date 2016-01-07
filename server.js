var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var moment = require('moment')
var http = require('http');
var request = require('request');
var Oauth = require('oauth');
var parser = require('xml2json');
var freebase = require('freebase');
var glossary = require('glossary');
var q = require('q')

var config = require(__dirname + '/config.js');

var app = express();
//For serving the index.html and all the other front-end assets.
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(cookieParser());

//The REST routes for maps by page
app.route('/maps/:pageId').get(function (req, res) {
  var token = "PUT THE F'n TOKEN HERE, DAMN";
  var url = "http://api.repo.nypl.org/api/v1/items/search.xml?q=maps&publicDomainOnly=true&page="+req.params.pageId;
  var auth = "Token token=" + token;
  var selfRes = res;
  request(
    {
      url : url,
      headers : {
        "Authorization" : auth
      }
    },
    function (error, response, body) {
      var fullRes = parser.toJson(body)
      selfRes.send(fullRes);
    }
  );
});



//If we reach this middleware the route could not be handled and must be unknown.
app.use(handle404);

//Generic error handling middleware.
app.use(handleError);

//Page-not-found middleware.
function handle404(req, res, next) {
  res.status(404).end('not found');
}

//generic error handling middleware.
function handleError(err, req, res, next) {
  console.error(err.stack); 
  //send back a 500 page and log the error to the console.
  res.status(500).json({err: err.message});
}


//store the db connection and start listening on a port.
function startExpress() {
  app.listen(config.express.port);
  console.log('Listening on port ' + config.express.port);
}

//start it up
startExpress();








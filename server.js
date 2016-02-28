var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var moment = require('moment');
var http = require('http');
var request = require('request');
var q = require('q')
var r = require('rethinkdb')
var _ = require('underscore')

var config = require(__dirname + '/config.js');
//token stuff for NYPL
var token = "4owjcjvs7pjha8ln";
var auth = "Token token=" + token;
// at page 4 in db
var mapPageNumber=100;

var app = express();

app.use(express.static(__dirname+'/www'));
app.use(bodyParser.json());
app.use(cookieParser());

// rethink
var connection = null;

function getDbConn() {
  var connectionPromise = q.defer();
  r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
      if (err) console.log(err);
      connection = conn;
      connectionPromise.resolve();
  });
  return connectionPromise.promise;
}

// get connection and then make table
getDbConn().then(function() {
  r.tableList().contains('maps').do(function(containsTable) {
    return r.branch(
      containsTable,
      {created: 0},
      r.tableCreate('maps')
    );
  }).run(connection, function(err) {
    //so something on error
  });
});

// routes
app.route('/getMoreMaps')
  .get(getMaps)

app.route('/maps')
  .get(getMapsFromDb)

app.route('/maps/:id')
  .get(getMapsFromDb)

function getMaps(req, res, next) {
  var url = "http://api.repo.nypl.org/api/v1/items/search.json?q=maps&publicDomainOnly=true&page="+mapPageNumber;
  var selfRes = res;
  request(
    {
      url : url,
      headers : {
        "Authorization" : auth
      }
    },
    function (error, response, body) {
      if(error) { console.log(error); }
      var jsonBody = JSON.parse(body);
      var counter = 0;
      var promises = [];

      _.each(jsonBody.nyplAPI.response.result, function (result) {
        var apiURL = result.apiItemURL
        var checkDb = q.defer();
        promises.push(checkDb.promise);
        r.table('maps').filter({url:apiURL}).run(connection, function(err, cursor) {
          if (err) throw err;
          cursor.toArray(function(err, result) {
            if (err) { throw err; }
            if (!result.length) {
              getImageLinks(apiURL);
              counter++;
            }
            checkDb.resolve();
          });
        });
      });

      mapPageNumber++;

      q.all(promises).then(function() {
        selfRes.send({number:counter})
      });
    }
  );
}

function getImageLinks(url) {
  request(
    {
      url : url,
      headers : {
        "Authorization" : auth
      }
    },
    function (error, response, body) {
      var jsonBody = JSON.parse(body);
      var highRes, image, imageDownload;
        
      imageDownload = jsonBody.nyplAPI.response.capture[0].imageLinks.imageLink[0];
      image = imageDownload.replace('&download=1','');
      highRes = jsonBody.nyplAPI.response.capture[0].highResLink;

      r.table('maps').insert({url:url, image:image, imageDownload:imageDownload, highRes:highRes}).run(connection, function(err, result) {
        if (err) throw err;
      });
    }
  );
}

function getMapsFromDb(req, res, next) {
  console.log('getting maps')
  var selfRes = res;
  var mapNum;
  if (!req.params.id) { mapNum = 1 } else { mapNum = parseInt(req.params.id) }
  r.table('maps').slice(mapNum,mapNum+1).run(connection, function(err, cursor) {
    if (err) console.log(err);
    cursor.toArray(function(err, result) {
        selfRes.send(JSON.stringify(result))
    });
});
}



app.listen(config.express.port);
console.log('Listening on port ' + config.express.port);








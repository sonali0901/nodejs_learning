var fs = require('fs');

var http = require('http');

var https = require('https');

var privateKey = fs.readFileSync(__dirname + '/server.key', 'utf8');

var certificate = fs.readFileSync(__dirname + '/server.cert', 'utf8');

var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/locationapi';

var express = require('express');

var app = express();

var path = require('path');

var credentials = {

  key: privateKey,

  cert: certificate

};


var httpServer = http.createServer(app);

var httpsServer = https.createServer(credentials, app);


httpServer.listen(9080);

httpsServer.listen(9090);


app.use(bodyParser.json());


app.get('/', function (request, response) {

  response.writeHead(200, {

    'Content-Type': 'text/html'

  });

  response.end('Hello World')

});


app.get('/api/first', function (request, response) {

  var locationType = request.body.type;

  var createdAt = request.body.createdAt;

  console.log(locationType);

  console.log(createdAt);

  var date1 = new Date(createdAt);

  date1.setDate(date1.getDate() + 1);

  var count = 2;

  var skip;

  if (request.body.pageNumber)

    skip = parseInt((request.body.pageNumber - 1) * count);

  else

    skip = 0;

  MongoClient.connect(url, function (err, client) {

    if (err)

      throw err;

    console.log('Connected');

    var db = client.db('locationapi');

    var cursor = db.collection('dbLocations').find({

      $and: [{

          type: locationType

        }, {

          createdAt: {

            "$gte": new Date(createdAt),

            "$lt": date1

          }

        }

      ]

    }, {

      skip: skip,

      limit: count

    }).toArray(function (err, docs) {


      if (err)

        return response.status(500).send({

          error: err

        })

      console.log(docs)

      response.send(docs)

    });


    client.close();

  });

});


app.get('/api/second', function (request, response) {

  var locationType = request.body.type;

  var longitude = parseFloat(request.body.longitude);

  var latitude = parseFloat(request.body.latitude);

  var kiloMeters = 10;


  // 1km in degree = 1 / 111.32km = 0.0089

  var noOfDegrees = 0.0089 * kiloMeters;


  var latHigh = latitude + noOfDegrees;

  var latLow = latitude - noOfDegrees;


  var longHigh = longitude + noOfDegrees / Math.cos(latHigh * 0.018);

  var longLow = longitude - noOfDegrees / Math.cos(latLow * 0.018);


  MongoClient.connect(url, function (err, client) {

    if (err)

      throw err;

    console.log('Connected');

    var db = client.db('locationapi');

    // error handling needed for all variables

    // can use coordinate-parser

    var cursor = db.collection('dbLocations').find({

      $and: [{

          type: locationType

        }, {

          $and: [{

              "coordinates.0": {

                $gte: latLow,

                $lte: latHigh

              }

            }, {

              "coordinates.1": {

                $gte: longLow,

                $lte: longHigh

              }

            }

          ]

        }

      ]

    }).toArray(function (err, docs) {

      if (err)

        return response.status(500).send({

          error: err

        })

      console.log(docs)

      response.send(docs)

    });


    client.close();

  });

});

var errorPage = path.join(__dirname, "/404.html");
app.get('*', function(request, response){
  response.sendFile(errorPage);
}); 

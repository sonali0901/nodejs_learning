var MongoClient = require('mongodb').MongoClient;
var url ='mongodb://localhost:27017/locationapi';
var date = "2016-05-18"
var date1 = new Date(date)
date1.setDate(date1.getDate() + 1);
var myDate = new Date(date+"T16:00:00Z");


MongoClient.connect(url, function(err, client) {
	if (err) throw err;
	console.log('Connected');
	console.log(date1);
	var db = client.db('locationapi');
	var cursor = db.collection('dbLocations').find();

    	cursor.each(function(err, doc) {

        console.log(doc);
	});

  	client.close();
});

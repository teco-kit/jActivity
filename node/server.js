var express = require("express"),
bodyParser = require("body-parser"),
mysql = require("mysql"),
url = require("url"),
path = require("path"),
fs = require("fs"),
pathExists = require('path-exists');


var connection	= mysql.createConnection({
    host	: 'mysql',
    port	: '3306',
    user	: 'admin',
    password: 'admin',
    database: 'jactivity2'
});

connection.connect(function(error) {
    if(!error) {
        console.log("Database connection established.");
    } else {
        console.log("Database connection failed.");
    }
});

var app = express();

app.use(bodyParser.text({limit: '50mb'}));

function getQuery(query, res) {
	var json = '';
    connection.query(query, function(err, results, fields) {
        if (err) {
	        res.json(err);
            return;
        }

        console.log('The first query-result is: ', results[0]);

        console.log('json:', json);
        res.json(results);
    });
}


// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Hooray! welcome to our api!' });
});


router.route('/labels')

// create a new label (accessed at POST)
.post(function(req, res) {

	//TODO: Implement create labels

})

// get all the labels (accessed at GET)
.get(function(req, res) {

    getQuery('SELECT * FROM `labels`', res);

});


router.route('/features')

// create a feature (accessed at POST)
.post(function(req, res) {

  var json = JSON.parse(req.body);
  console.log(JSON.stringify(json));
  var query = 'INSERT INTO `labels` (';
  var keys = "", values = "";

 for(var data in json) {
     keys += '`' + data + '`, ';
     values += "'" + json[data] + "',";
 }
 keys = keys.slice(0, -2);
 values = values.slice(0, -1);
 query += keys + ') VALUES(' + values + ');';
 console.log(query);
 connection.query(query, function(err, results, fields) {
        if (err) {
            return;
        }
    });
 res.header("Access-Control-Allow-Origin", "*");
 res.end();

})

// get all the features (accessed at GET)
.get(function(req, res) {

    getQuery('SELECT * FROM `features`', res);

});

router.route('/features/:feature')

.post(function(req, res) {
	var feature = req.params.feature;
	var json = JSON.parse(req.body);
    console.log(JSON.stringify(json));
    var query = 'INSERT INTO `' + json['sensor'] + '` (';
	var keys = "", values = "";


	delete json['sensor'];

	for(var data in json) {
	    keys += '`' + data + '`, ';
	    values += "'" + json[data] + "',";
	}
	keys = keys.slice(0, -2);
	values = values.slice(0, -1);
	query += keys + ') VALUES(' + values + ');';
	//var query = 'INSERT INTO `deviceorientation_apple_chrome_470` (`id`,`label`,`timestamp`,`beta`,`gamma`,`alpha`,`absolute`) VALUES ("1","Sitting","' + Date.now() + '","' + json["beta"] + '","' + json["gamma"] + '","' + json["alpha"] + '","' + json["absolute"] + '")';
	console.log(query);
	connection.query(query, function(err, results, fields) {
        if (err) {
            return;
        }
    });
	res.header("Access-Control-Allow-Origin", "*");
	res.end();
})

// get the feature with that id
.get(function(req, res) {

	var feature = req.params.feature;
	getQuery('SELECT * FROM `' + feature + '`', res);

})

// update the feature with this id
.put(function(req, res) {

})

// delete the feature with this id
.delete(function(req, res) {

});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(3000,function() {
    console.log("jactivity2 started on port 3000");
})

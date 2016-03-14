var express = require("express"),
  bodyParser = require("body-parser"),
  mysql = require("mysql"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  pathExists = require('path-exists');


var pool = mysql.createPool({
  connectionLimit: 50,
  host: 'mysql',
  user: 'admin',
  password: 'admin',
  database: 'jactivity2'
});

function handle_database(req, res) {

  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({
        "code": 100,
        "status": "Error in connection database"
      });
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(req, function(err, rows) {
      connection.release();
      if (!err) {
        res.json(rows);
      }
    });

    connection.on('error', function(err) {
      res.json({
        "code": 100,
        "status": "Error in connection database"
      });
      return;
    });
  });
}

var app = express();

app.use(bodyParser.text({
  limit: '50mb'
}));


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
  res.json({
    message: 'Hooray! welcome to our api!'
  });
});


router.route('/labels')

// create a new label (accessed at POST)
.post(function(req, res) {

  var json = JSON.parse(req.body);
  console.log(JSON.stringify(json));
  var query = 'INSERT INTO `labels` (';
  var keys = "",
    values = "";

  for (var data in json) {
    keys += '`' + data + '`, ';
    values += "'" + json[data] + "',";
  }
  keys = keys.slice(0, -2);
  values = values.slice(0, -1);
  query += keys + ') VALUES(' + values + ');';
  console.log(query);
  var res;
  handle_database(query, res);
  res.header("Access-Control-Allow-Origin", "*");
  res.end();

})

// get all the labels (accessed at GET)
.get(function(req, res) {

  handle_database('SELECT * FROM `labels`', res);

});


router.route('/features')

// create a feature (accessed at POST)
.post(function(req, res) {

  //TODO: Implement create features

})

// get all the features (accessed at GET)
.get(function(req, res) {

  handle_database('SELECT * FROM `features`', res);

});

router.route('/features/:feature')

.post(function(req, res) {
  var feature = req.params.feature;
  var json = JSON.parse(req.body);
  console.log(JSON.stringify(json));
  var query = 'INSERT INTO `' + json['sensor'] + '` (';
  var keys = "",
    values = "";


  delete json['sensor'];
  var labels = json['labels'];
  delete json['labels'];

  for (var data in json) {
    keys += '`' + data + '`, ';
    values += "'" + json[data] + "',";
  }
  keys = keys.slice(0, -2);
  values = values.slice(0, -1);
  for (var label in labels) {
    keys += '`label`';
    values += "'" + label + "'";
    query += keys + ') VALUES(' + values + ');';
    console.log(query);
    var res;
    handle_database(query, res);
  }
  res.header("Access-Control-Allow-Origin", "*");
  res.end();
})

// get the feature with that id
.get(function(req, res) {

  var feature = req.params.feature;
  handle_database('SELECT * FROM `' + feature + '`', res);

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
app.listen(3000, function() {
  console.log("jactivity2 started on port 3000");
})

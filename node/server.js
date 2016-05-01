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
    res.header("Access-Control-Allow-Origin", "*");
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
  var keys = "",
    values = "";

  var sensor = json['sensor'];
  delete json['sensor'];
  var labels = json['labels'];
  delete json['labels'];

  for (var data in json) {
    keys += '`' + data + '`, ';
    values += "'" + json[data] + "',";
  }
  for (var i = 0; i < labels.length; i++) {
    var query = 'INSERT INTO `' + sensor + '` (';
    query += keys + '`label`) VALUES(' + values + "'" + labels[i] + "');";
    console.log(query);
    var res;
    handle_database(query, res);
  }
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

router.route('/data')

// get all the features (accessed at GET)
.get(function(req, res) {
  var features = JSON.parse(req.query.features);
  var labels = JSON.parse(req.query.labels);

  pool.getConnection(function(err, connection) {
    res.header("Access-Control-Allow-Origin", "*");
    if (err) {
      connection.release();
      res.json({
        "code": 100,
        "status": "Error in connection database"
      });
      return;
    }

    console.log('connected as id ' + connection.threadId);
    var total = 0;
    for(var feature in features) {
      var query = "SELECT * FROM `" + feature + "` WHERE `label` IN (" + json(labels) + ")";
      console.log(query);
      connection.query(query, function(err, rows) {
        connection.release();
        if (!err) {
          total += rows.length;
        }
      });

      connection.on('error', function(err) {
        res.json({
          "code": 100,
          "status": "Error in connection database"
        });
        return;
      });
    }
  });

  res.json(total);

});

router.route('/classifier/:uid/*')

.post(function(req, res) {
  var uid = req.params.uid;
  var classifiers = JSON.parse(req.query.classifiers);
  for(var classifier in classifiers) {
    var query = 'INSERT INTO `classifiers` (`uid`, `name`, `features`,`labels`) VALUES(' + uid + ',"' + classifier.name + '","' + JSON.stringify(classifier.features) + '","' + JSON.stringify(classifier.labels) + '")';
    console.log(query);
    var res;
    handle_database(query, res);
  }
})

// get all the features (accessed at GET)
.get(function(req, res) {
  if(req.params[0] == "jactivity.js") {
    res.header("Access-Control-Allow-Origin", "*");
    var uid = req.params.uid;
    fs.stat('./classifier/' + uid + '.js', function(err, stat) {
      if(err == null) {
          // SERVE JAVASCRIPT FILE
          console.log('Classifier ' + uid + '.js exists');
          res.sendfile(uid + '.js', {root: './classifier'});
      } else if(err.code == 'ENOENT') {
          // GENERATE JAVASCRIPT FILE
          var jactivityTemplate = fs.readFileSync('./classifier/jactivity.template','utf8');
          var classifierTemplate = fs.readFileSync('./classifier/classifier.template','utf8');
          var classifiers;
          pool.getConnection(function(err, connection) {
            if (err) {
              return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query("SELECT * FROM `classifiers` WHERE `uid`=' " + uid + "'", function(err, rows) {
              connection.release();
              if (err) {
                return;
              }
              classifiers = rows;
            });
          });
          var classifierJS = "";
          var classifierImpl = "";
          for(var classifier in classifiers) {
            var features = JSON.parse(classifier.features);
            var labels = JSON.parse(classifier.labels);
            var initialize = "";
            var helper = "";
            classifierImpl += classifier.name + "Classifier(callback, label, interval) {\nreturn new " + classifier.name + "Classifier(callback, label, interval, this.host, this.XSL)\n}\n";
            for(var feature in features) {
              initialize += fs.readFileSync('./features/' + feature + '.initialize.js','utf8');
              helper += fs.readFileSync('./features/' + feature + '.helper.js','utf8');
            }
            var replacements = {"%NAME%":classifier.name, "%FEATURES%":classifier.features, "%INITIALIZE%": initialize, "%HELPERFUNCTIONS%": helper};
            classifierJS += classifierTemplate.replace(/%\w+%/g, function(all) {
               return replacements[all] || all;
            });
            classifierJS += '\n';
          }

          var replacements = {"%CLASSIFIER%":classifierImpl};

          var jactivityJS = jactivityTemplate.replace(/%\w+%/g, function(all) {
             return replacements[all] || all;
          });
          var jActivity = jactivityJS + classifierJS;
          fs.writeFile('./classifier/' + uid + '.js', jActivity);
      } else {
          console.log('Error occured while trying to load classifier ' + path + ': ', err.code);
      }
    });
  }
});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(3000, function() {
  console.log("jactivity2 started on port 3000");
})

# jActivity

jActivity2 is a system designed to collect different sensor data on smartphones to train classifiers for the web. It is implemented as part for the Prosperity4All project funded by the European Union.
A web front-end allows web-developers to collect data for a given context with any available sensor. This data is stored in a MySQL database on the server, where it can be retrieved to create classifiers which run inside a website to detect the context.


## Requirements

jActivity2 requires [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/).


## Installing the server

Once Docker and docker-compose are installed, you can start installing the system.

First, checkout the git project.
Customize the ports on which the different services run by editing the 'docker-compose.yml' file located in the root directory.
Then run './start.sh' to start the system and let it run in the background.

The MySQL Database is stored in the 'data/mysql' directory.
The web front-end for collecting the sensor data is located in the 'data/collect' directory.


## Running a decision tree classifier in your website

To include jactivity into your website you have to define the features and id inside the 'classifier' table of the Database.
Using the id you can include the script as follow:
```javascript
<script src="http://{your host}/api/classifier/{id}/jactivity.js"></script>
```

To use the classifier, implement callback functions for every classifier using your desired labels and a classifying interval.
This is an example for a touch and activity classifier:
```javascript
var activityCallback = function(activity) {
switch(activity) {
  case "walking":
    document.body.style.fontSize = "1.2em";
    break;
  case "standing":
    document.body.style.fontSize = "1.0em";
    break;
  default:
    document.body.style.fontSize = "1.0em";
}
}    

var touchCallback = function(handedness) {
switch(handedness) {
  case "left":
    document.getElementById("test").innerHTML = "Left Handed";
    break;
  case "right":
    document.getElementById("test").innerHTML = "Right Handed";
    break;
  default:
    document.getElementById("test").innerHTML = "You dont have hands?";
}
}
var jactivity = new jActivity("jactivity.teco.edu");
var activityClassifier = jactivity.activityClassifier(activityCallback, ["walking","standing"], 1000);
var touchClassifier = jactivity.touchClassifier(touchCallback, ["left","right"], 10000);
```

Second, you need to include the transformer.js that allows to transform PMML models to javascript code.
```javascript
<script src="../pmml2js/js/transformer.js"></script>
```

And, in conjunction with that, you need to include a javascript specific for the PMML model type, e.g. decision tree:
```javascript
<script src="../pmml2js/js/decisiontree_engine.js"></script>
```


## Available Functionality

At the moment, only Decision Trees are supported as PMML models.


## Provide Training Data

You can provide training data by visiting the following website with your browser:
http://jactivity.teco.edu/collect/ or if you run the system on your server:
http://{your host}/collect/

There you can choose the sensor sources (devicemotion, deviceorientation, touch) and the label.

## Extend jActivity2

jActivity is designed to be modular, thereby allowing you to extend the library with your own code.
jActivity uses features to classify data. A feature includes multiple data sources like sensors and the logic to process data.
This data will be stored in a MySQL database and then used to create your classifier.
Extending jActivity consists of three parts:

1. Database table

   Write a SQL query which creates a new table with the name of the table being your feature and including at least the following columns:
   * id *(Varchar 200)*
   * timestamp *(Varchar 200)*
   * useragent *(Varchar 200)*
   * label *(Varchar 200)*

   Example for the feature touchevents
   ```sql
   CREATE TABLE `deviceorientation` (
     `id` varchar(200) NOT NULL,
     `timestamp` varchar(200) NOT NULL,
     `useragent` varchar(200) NOT NULL,
     `label` varchar(200) NOT NULL,
     `beta` varchar(200) NOT NULL,
     `gamma` varchar(200) NOT NULL,
     `alpha` varchar(200) NOT NULL,
     `absolute` varchar(200) NOT NULL DEFAULT 'undefined',
     PRIMARY KEY (`id`,`timestamp`)
   )
   ```

2. Collect data code

   To allow jActivity to collect the data for your feature you need to implement the following JavaScript template:
   ```javascript
   var FEATURENAME = function (sandbox) {

        // Your helper functions to process your data go here
        // Submit your final data as a json Object containing your
        // previously defined fields in MySQL, e.g.:
        // var json = {
        // sensor : 'devicemotion', REQUIRED
        // accelerationX : event.acceleration.x,
        // accelerationY : event.acceleration.y,
        // accelerationZ : event.acceleration.z
        // }
        // sandbox.send(json);

        return {
            start : function () {
    		    // Register your helper functions here
    		},
            stop : function () {
                // Destroy your helper functions here
            }
        }
   };
   ```
   Place your file with your feature name as the filename in `data/collect/src/scripts`

3. Classify data

   For the generator to include your feature in jActivity you need to implement three files located in `node/features`.
   * `FEATURE.initialize.js`

      This file includes the same initialization as put in the start function of the data collection
   * `FEATURE.helper.js`

      This file includes the same helper functions as put in the helper block of the data collection
   * `FEATURE.destroy.js`

      This file includes the same destroy functions as put in the stop block of the data collection

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

First, you have to include our jactivity javascript into your website:
```javascript
<script src="js/jactivity.js"></script>
```

This script can be adjusted to you personal needs.
At the end of the file, we send a post request to the opencpu server to receive the PMML classifiers.
First, you have to provide your hostname or IP, so that the OpenCPU server is accessed correctly.
Second, you can adjust the JSON file that is sent. In principle, you can specify:
* which sensors to access (e.g. "sensor": ["devicemotion", "deviceorientation"])
* which class labels to differentiate (e.g. "label": ["walking", "standing"] or "label": ["walking", "other"])
* which classifier to be used (e.g. "classifier": "rpart")

Example:
```[data: 'json_data={"sensor": ["devicemotion", "deviceorientation"],"label": ["walking", "standing"],"classifier": "rpart"}']```

At the beginning, you can set the "evaluateInterval" which defines how often the script evaluates the current sensor values against the classifier.
Currently, it is set to 2000ms.

With the switch statement within the evaluateData function, you can define the actions that will be caused by specific classifier results.
Exemplarily, the statement differentiates between walking and still and triggers different actions.

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
http://docker.teco.edu:82/collect/

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

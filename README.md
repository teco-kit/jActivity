# Host for Analytics Services

Allows querying prediction models and delivers them to requesting web applications.


## Installing the server

jActivity requires [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/).
Once [Docker] and [docker-compose] are isntalled, you can start installing the system.

First, checkout the git project.
Customize the ports on which the different services run by editing the 'docker-compose.yml' file located in the root directory.
Then run 'docker-compose up -d' to start the system and let it run in the background.

The MySQL Database is stored in the 'data/mysql' directory.
The web front-end for collecting the sensor data is located in the 'data/collect' directory.


## Running a decision tree classifier in your website

First, you have to include our jactivity javascript into your website:
[<script src="js/jactivity.js"></script>]

This script can be adjusted to you personal needs. 
At the end of the file, we send a post request to the opencpu server to receive the PMML classifiers. 
First, you have to provide your hostname or IP, so that the OpenCPU server is accessed correctly.
Second, you can adjust the JSON file that is sent. In principle, you can specify:
* which sensors to access (e.g. "sensor": ["devicemotion", "deviceorientation"])
* which class labels to differentiate (e.g. "label": ["walking", "standing"] or "label": ["walking", "other"])
* which classifier to be used (e.g. "classifier": "rpart")

Example:
[data: 'json_data={"sensor": ["devicemotion", "deviceorientation"],"label": ["walking", "standing"],"classifier": "rpart"}']

At the beginning, you can set the "evaluateInterval" which defines how often the script evaluates the current sensor values against the classifier.
Currently, it is set to 2000ms.

With the switch statement within the evaluateData function, you can define the actions that will be caused by specific classifier results.
Exemplarily, the statement differentiates between walking and still and triggers different actions. 

Second, you need to include the transformer.js that allows to transform PMML models to javascript code.
[<script src="../pmml2js/js/transformer.js"></script>]

And, in conjunction with that, you need to include a javascript specific for the PMML model type, e.g. decision tree:
[<script src="../pmml2js/js/decisiontree_engine.js"></script>]


## Available Functionality 

At the moment, only Decision Trees are supported as PMML models.



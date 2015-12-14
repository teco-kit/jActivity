# jActivity2

jActivity2 is a system designed to collect different sensor data on smartphones to train classifiers for the web. It is implemented as part for the Prosperity4All project funded by the European Union.
A web front-end allows web-developers to collect data for a given context with any available sensor. This data is stored in a MySQL database on the server, where it can be retrieved to create classifiers which run inside a website to detect the context.

## Requirements

jActivity2 requires [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/).

## Installation

Checkout the git project and run `docker-compose up` to start the system.

## Configuration

To customize the ports on which the different services run edit the `docker-compose.yml` file located in the root directory.

### Database

The MySQL Database is stored in the `data/mysql` directory.

### Web front-end

The web front-end for collecting the sensor data is located in the `data/collect` directory.

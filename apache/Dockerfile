# Set only apache as base image
FROM httpd:latest

# File Author / Maintainer
MAINTAINER  David Greiner <greiner@teco.edu>

COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf

# Change working directory to htdocs
WORKDIR /usr/local/apache2/htdocs/

# Symlink websites into htdocs directory
RUN ["ln", "-s", "/data/collect/build", "collect"]

RUN ["ln", "-s", "/data/example", "example"]

RUN ["ln", "-s", "/data/models", "models"]

RUN ["ln", "-s", "/data/pmml2js", "pmml2js"]

RUN ["ln", "-s", "/data/stylesheets", "stylesheets"]

RUN ["ln", "-s", "/data/transformationstyles", "transformationstyles"]

# Set only apache as base image
FROM httpd:latest

# File Author / Maintainer
MAINTAINER  David Greiner <greiner@teco.edu>

# Change working directory to htdocs
WORKDIR /usr/local/apache2/htdocs/

# Symlink websites into htdocs directory
RUN ["ln", "-s", "/data/collect/build", "collect"]
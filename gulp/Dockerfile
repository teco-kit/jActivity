# Set nodejs base image
FROM node:latest

# File Author / Maintainer
MAINTAINER  David Greiner <greiner@teco.edu>

# Change working directory to collect website on volume
WORKDIR /data/collect

# Install gulp build system
RUN npm install -g gulp

# Watch files for changes and build in real-time
CMD ["gulp", "watch"]

# Set nodejs base image
FROM node:latest

# File Author / Maintainer
MAINTAINER  David Greiner <greiner@teco.edu>

# Change working directory to collect website on volume
#WORKDIR /data/collect

#RUN npm install

# Install gulp build system
#RUN npm install -g gulp

#CMD ["npm", "install"]

#CMD ["npm", "install", "-g", "gulp"]

# Watch files for changes and build in real-time
#CMD ["gulp", "watch"]

#CMD cd /data/collect && npm install && gulp build && gulp watch
#CMD cd /data/collect && gulp watch
#CMD ls /data/collect

CMD cd /data/collect && npm install

# Set nodejs base image
FROM node

# File Author / Maintainer
MAINTAINER  David Greiner <david@ultitech.de>

RUN mkdir /app

WORKDIR /app

ADD package.json package.json
ADD server.js server.js

RUN npm install

EXPOSE 8888

CMD ["npm", "start"]

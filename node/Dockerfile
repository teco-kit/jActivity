# Set nodejs base image
FROM node

# File Author / Maintainer
MAINTAINER  David Greiner <david@ultitech.de>

RUN mkdir /app

WORKDIR /app

ADD package.json package.json
ADD classifier classifier
ADD features features

RUN npm install

ADD server.js server.js

EXPOSE 8888

CMD ["npm", "start"]

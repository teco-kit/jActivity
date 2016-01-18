FROM node:0.12.7

WORKDIR /data

RUN npm install -g bower gulp

RUN bower install --allow-root

CMD ["gulp", "watch"]
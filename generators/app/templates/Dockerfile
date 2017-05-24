FROM node:6.9-alpine

RUN apk add --update git && rm -rf /tmp/* /var/cache/apk/*

RUN npm config set registry http://registry.npmjs.org && npm cache clean

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install --unsafe-perm && npm cache clean

COPY . /usr/src/app

RUN rm -rf .env && touch .env

EXPOSE 3000

CMD [ "npm", "start" ]

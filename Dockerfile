FROM node:14-alpine

ENV HOST=0.0.0.0

WORKDIR /usr/src/app
COPY . /usr/src/app


RUN npm install && npm run build

CMD [ "npm", "run", "start" ]

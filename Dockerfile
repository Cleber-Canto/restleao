FROM node:16.20-slim

WORKDIR ./app
#WORKDIR .
COPY package.json yarn.lock /app/

RUN yarn

COPY . /app

EXPOSE 3091

CMD ["yarn","start"]
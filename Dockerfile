FROM node:18

WORKDIR /usr/app

COPY package*.json .

RUN npm install --global yarn

RUN yarn install

COPY . .

CMD ["yarn", "start:dev"]
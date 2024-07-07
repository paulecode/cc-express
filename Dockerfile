FROM node:20

WORKDIR /src

ENV YARN_VERSION 3.0.0

RUN yarn install

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]

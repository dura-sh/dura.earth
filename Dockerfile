FROM circleci/node:latest-browsers

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN npm install

COPY ./ ./

RUN npm run test

CMD ["npm", "run", "build"]

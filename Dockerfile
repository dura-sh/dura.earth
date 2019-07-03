FROM circleci/node:latest-browsers
EXPOSE 80

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN npm install

COPY ./ ./

RUN npm run test

CMD ["npm", "run", "build"]

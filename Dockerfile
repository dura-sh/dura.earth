FROM circleci/node:latest-browsers

WORKDIR /pub
USER root
COPY package.json ./
RUN npm install
RUN npm run build

# Build
ONBUILD ADD public/ /pub

---
order: 4
title: Dura Protocol Network
type: Basic Overview
---

## The Network Result from the Dura Protocol

Talk abou tthe network

# durabase
A durable peer-to-peer databasing solution using surety for pure identity referencing.

# Running Durabase code in containers

[Docker](https://github.com/docker/docker-ce) is a tool for running software in containers ie. OS-level virtualization. This directory contains the needed configuration files to:

- Build base Docker images for Durabase


## Base Docker image

[Dockerfile](Dockerfile) defines Durabase base images that are based on [official node.js -image](https://hub.docker.com/_/node/). 

Build local images with command (in repository root):

```bash
docker build -t durabase -f docker/Dockerfile .
```

After building local image, run node.js-examples inside container:

```bash
docker run -ti --rm durabase npm run examples:node
```

## Why would you want to run Durabase in container?

Containers are nice because as software execution environments they are:
- Reproducible, which helps testing and development because you can revert the container to original state by destroying it and creating it again,
- Isolated, which guarantees that external factors like npm versions, the operating system version, or other installed software like native compilers do not affect the execution.

They also make implementing virtualized networks for testing and benchmarking easier, which may help projects that use Durabase.

## Tested versions

- Docker 1.13.1 (Linux 4.17.5-100.fc27.x86_64)
- Docker 18.06.1-ce (Linux 4.17.5-100.fc27.x86_64)

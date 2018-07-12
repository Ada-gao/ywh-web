#!/bin/bash

npm run build
docker build -t 10.9.60.202/ywh/ywh-web .
docker push 10.9.60.202/ywh/ywh-web


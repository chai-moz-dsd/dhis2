#!/usr/bin/env bash

password=$1

echo "build dhis2 image"
docker build -t chaimozdsd/dhis2-src:2.24 .

docker login -u="chaimozdsd" -p=${password}
docker push chaimozdsd/dhis2-src
#!/bin/sh
#navigate to the app directory
cd app
#install dependencies
npm install
#build it
npm run build
#run tests
npm run test

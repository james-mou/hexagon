#!/bin/sh
# navigate to the app directory
cd app
# install all dependencies
npm install
# build the app
npm run build
# run it
npm run dev

@echo off
REM navigate to the app directory
cd app

REM install all dependencies
npm install

REM build the app
npm run build

REM run it
npm run dev

pause

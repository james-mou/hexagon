@echo off
REM navigate to the app directory
cd app

REM install dependencies
npm install

REM build it
npm run build

REM run the tests
npm run test

REM pause 
pause

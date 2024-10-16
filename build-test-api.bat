@echo off
REM navigate to the api directory
cd api

REM build the solution
dotnet build LogReaderApi.sln

REM run the tests
dotnet test LogReaderApi.sln

REM pause 
pause

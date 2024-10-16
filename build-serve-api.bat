@echo off
REM navigate to the api directory
cd api

REM build the solution
dotnet build LogReaderApi.sln

REM run the specified project
dotnet run --project ./Hexagon.LogReader.Host/Hexagon.LogReader.Host.csproj

REM pause 
pause

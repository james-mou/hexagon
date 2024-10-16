#!/bin/sh
#navigate to the api directory
cd api
#clean the solution
dotnet clean LogReaderApi.sln
#build the solution
dotnet build LogReaderApi.sln
#run the specified project
dotnet run --project ./Hexagon.LogReader.Host/Hexagon.LogReader.Host.csproj

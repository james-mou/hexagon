#!/bin/sh
#navigate to the api directory
cd api
#build the solution
dotnet build LogReaderApi.sln
#run the specified project
dotnet run --project ./Hexagon.LogReader.Host/Hexagon.LogReader.Host.csproj

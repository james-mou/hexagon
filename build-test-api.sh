#!/bin/sh
#navigate to the api directory
cd api
#build the solution
dotnet build LogReaderApi.sln
#run tests
dotnet test LogReaderApi.sln

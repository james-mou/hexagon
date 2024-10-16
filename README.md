# For both

Both the api and frontend were done with vscode.

depending on the your environment, there are two sets of scripts, namely .sh and .bat files, the script names should be self-explanatory

the .sh files are looking for the shell at /bin/sh, whatever your environment linked that to, no shell-specific features are used in the .sh files.

the .bat scripts were never tested because I don't have a windows installation sitting around, due to their simplicity, I am pretty sure they work.

# For the API

the command "dotnet" is assumed to be in the path, backed by .NET 8.0
the api used some C# 12 features, because I can, hence you need a runtime that supports that.

./build-serve-api.sh(or bat) will serve the api on http://localhost:5183

./build-test-api.sh(or bat) will run all unit tests for the api

if you want to replace the test input file, overwrite epa-http.txt under Hexagon.LogReader.Host/Data/ folder,
a restart of the API is required, because the content of this file is cached in a singleton service

# For the APP

the command "npm" is assumed to be path and not terribly out-of-date, the code was developed on node v20.11.1 and npm 10.8.1, but it's just the frontend, not making use of any specific features provided by node, so older versions should serve it just fine.

./build-serve-app.sh(or bat) will serve the react frontend on http://localhost:5184

./build-test-app.sh(or bat) will run all unit tests for the react frontend

# Misc

All bad-looking ricidulous malformed log line patterns found in the given epa-http.txt file are handled as gracefully as possible,
so you won't see any problems parsing that file, if you manage to invent new error patterns in another test input txt file, sure it
will still produce errors, the exact line number and line content that is causing the parsing exception will be displayed on the
frontend UI.

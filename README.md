# Getting Started

## Intro

This document is intended to learn you how to use RAML 1.0 JavaScript parser.

## Installation

###	Pre-required software

1.	[NodeJS](https://nodejs.org/en/download/)
1.	Install [git](https://git-scm.com/downloads)

###	RAML 1.0 JavaScript parser installation
1. Create package.json file which should contain at least a dependency to raml-js-parser NodeJS module:
  ```
  {
    "name": "myParserTest",
    "dependencies": {
      "raml-1-0-parser": "https://github.com/raml-org/raml-js-parser-2",
      "typescript": "*"
    }
  }
  ```
1.	Use your favorite text editor to create JavaScript file (name it, f.e. test.js):

	```
	var raml = require("raml-1-0-parser");
	```

1. Run ```npm install ``` and wait while all the dependencies are downloaded
and properly initialized.

1. Run ```node test.js```. If you see no any exceptions - you were able to install raml-js-parser successfully.

## Loading RAML files and using RAML JS API to analyze them

1. Edit your test.js file to include RAML file loading:
  ```
  var raml = require("raml-1-0-parser");
  var fs = require("fs");
  var path = require("path");

  var fName = path.resolve(__dirname + "/node_modules/raml-1-0-parser/raml-specs/XKCD/api.raml");
  var api = raml.loadApi(fName).getOrThrow();
  ```
  Note that we specified a path to sample RAML file that is included in raml-js-parser. You might want to specify your own RAML file here. To do this, create your RAML 1.0 file using Atom editor with installed [apiworkbench plugin](http://apiworkbench.com/docs/), then save your RAML file and its dependencies somewhere and enter this file's path into test.js code.

1. Run ```nodejs test.js``` again. If you see no errors in output - your file was parsed successfully.

1. Now, let's enumerate all the requests RAML file contains. For that, let's add the following code into test.js:

  ```
  api.resources().forEach(function (resource) {
  	resource.methods().forEach(function (method) {
  		method.responses().forEach(function (resp) {
  			console.log("\t",
  				resource.relativeUri().value(),
  				method.method(),
  				resp.code().value());
  		});
  	});
  });
  ```
  In this code, we enumerate all resources, all methods inside each of them, and all the response codes that could be returned by any of methods. Let's run the resulting file and see what it returns:
  ```
  /{comicId}/info.0.json get 200
  /info.0.json get 200
  ```
  You can use this information to generate own server or client stubs for HTTP API, or documentation for them.

1. For generating typed API we need an access to types, described in RAML files. Let's modify our test.js to enumerate all the types from RAML file:
  ```
  api.types().forEach(function (type) {
  	console.log(type.name());

  	type.properties().forEach(function(prop) {
  		console.log("\t", prop.name());
  	});
  });
  ```

  this should enumerate all types' names properties.

1. About an every object in RAML 1.0 (type, property, request, method, response) can have an array of annotations, associated with it. These annotations can describe additional info, associated with the object. For example, here how we can enumerate all annotations on all types:
  ```
  api.types().forEach(function (type) {
  	console.log(type.name());

  	type.properties().forEach(function(prop) {
  		console.log("\t", prop.name());
  	});
  });
  ```

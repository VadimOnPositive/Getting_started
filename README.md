# Getting Started

## Intro

This document is intended to learn you how to use RAML 1.0 JavaScript parser.

## Installation

###	Pre-required software

1.	[NodeJS](https://nodejs.org/en/download/)
1.	Install [git](https://git-scm.com/downloads)

###	RAML 1.0 JavaScript parser installation
1. Run command line tool and create a folder where all you test files will be stored.

1. Create package.json file which should contain at least a dependency to raml-js-parser NodeJS module:
  ```json
  {
    "name": "myParserTest",
      "dependencies":
      {
        "raml-1-0-parser": "https://github.com/raml-org/raml-js-parser-2",
        "typescript": "*" // This line is temporary and required only to workaround a bug. Will be removed soon.
      }
  }
  ```
1.	Use your favorite text editor to create test.js JavaScript file:

	```js
  // step1
	var raml = require("raml-1-0-parser");
	```

1. Run ```npm install ``` and wait while all the dependencies are downloaded
and properly initialized.

1. Run ```node test.js```. If you see no any exceptions - you were able to install raml-js-parser successfully.

## Loading RAML files and using RAML JS API to analyze them

1. Edit your test.js file to include RAML file loading:
  ```js
  // step2
  var fs = require("fs");
  var path = require("path");

  // Here we create a file name to be loaded
  var fName = path.resolve(__dirname + "/node_modules/raml-1-0-parser/raml-specs/XKCD/api.raml");

  // Parse our RAML file with all the dependencies
  var api = raml.loadApi(fName).getOrThrow();
  ```
  Note that we specified a path to sample RAML file that is included in raml-js-parser. You might want to specify your own RAML file here. To do this, create your RAML 1.0 file using Atom editor with installed [apiworkbench plugin](http://apiworkbench.com/), then save your RAML file and its dependencies somewhere and enter this file's path into test.js code.

1. Run ```nodejs test.js``` again. If you see no errors in output - your file was parsed successfully.

## Working with real RAML projects.

1. First, let's checkout more complex RAML project from GIT. For our experiments we will use Box sample that could be downloaded from the [github](https://github.com/raml-apis/Box).
  For this, checkout Raml1.0 project from the site:
  ```
  git clone https://github.com/raml-apis/Box.git
  cd Box
  git checkout -b raml1.0 origin/raml1.0
  ```

1. Now, let's enumerate all the requests RAML file contains. For that, let's add the following code into test.js:

  ```js
  var raml = require("raml-1-0-parser");

  var fs = require("fs");
  var path = require("path");

  // Here we create a file name to be loaded
  // var fName = path.resolve(__dirname + "/node_modules/raml-1-0-parser/raml-specs/XKCD/api.raml");
  var fName = path.resolve("e:/git/Box/boxAPI.raml");

  // Parse our RAML file with all the dependencies
  var api = raml.loadApi(fName).getOrThrow();

  /**
   * Process resource (here we just trace different paramters of URL)
   **/
  function processResource(res) {
  	console.log("======================================");

  	// User-friendly name (if provided)
  	if (res.displayName()) {
  		console.log(res.displayName());
  	}

  	// Trace resource's relative URI
  	var relativeUri = res.relativeUri().value();
  	// Next method returns full relative URI (which is equal with previous one
  	// for top-level resources, but for subresources it returns full path from the
  	// resources base URL)
  	var completeRelativeUri = res.completeRelativeUri();
  	// trace both of them
  	console.log(completeRelativeUri, "(", relativeUri, ")");

  	// Let's enumerate all URI parameters
  	for (var uriParamNum = 0; uriParamNum < res.allUriParameters().length; ++uriParamNum) {
  		var uriParam = res.allUriParameters()[uriParamNum];
  		// Here we trace URI parameter's name and types
  		console.log("\tURI Parameter:", uriParam.name(), uriParam.type().join(","));
  	}

  	// Recursive call this function for all subresources
  	for (var subResNum = 0; subResNum < res.resources().length; ++subResNum) {
  		var subRes = res.resources()[subResNum];
  		processResource(subRes);
  	}
  }

  // Enumerate all the resources
  for (var resNum = 0; resNum < api.resources().length; ++resNum) {
  	processResource(api.resources()[resNum]);
  }
  ```

1. For generating typed API we need an access to types, described in RAML files. Let's modify our test.js to enumerate all the types from RAML file:
  ```js
  api.types().forEach(function (type) {
  	console.log(type.name());

  	type.properties().forEach(function(prop) {
  		console.log("\t", prop.name());
  	});
  });
  ```

  this should enumerate all types' names properties.

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
	// The next method returns full relative URI (which is equal with previous one
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

console.log("-------------------------------");

// Enumerate traits
for (var traitNum = 0; traitNum < api.traits().length; ++traitNum) {
	var trait = api.traits()[traitNum];
	console.log("Trait", trait.name());

	for (var qParNum = 0; qParNum < trait.queryParameters().length; ++qParNum) {
		var qPar = trait.queryParameters()[qParNum];

		console.log("\t", qPar.name(), qPar.type(), qPar.default(), qPar.description().value());
	}
}

console.log("-------------------------------");

// Enumerate schemas
for (var schemaNum = 0; schemaNum < api.schemas().length; ++schemaNum) {
	var schema = api.schemas()[schemaNum];

	console.log("\t", schemaNum, schema.getKind());
}

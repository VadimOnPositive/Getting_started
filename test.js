var raml = require("raml-1-0-parser");

var fs = require("fs");
var path = require("path");

// Here we create a file name to be loaded
var fName = path.resolve(__dirname + "/node_modules/raml-1-0-parser/raml-specs/XKCD/api.raml");

// Parse our RAML file with all the dependencies
var api = raml.loadApi(fName).getOrThrow();

//------------------------------------------------------------------------------
// node.js MongoDB Backend API Starter example for Cloud Foundry
//------------------------------------------------------------------------------

// This application uses express as its web server
var express = require("express");
// create a new express server
var app = express();

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See
// http://expressjs.com/api#app-settings for more details.
app.enable("trust proxy");

// body parser
var bodyParser = require("body-parser");
//path
var path = require("path");
// cfenv provides access to your Cloud Foundry environment
var cfenv = require("cfenv");

// get the app environment from Cloud Foundry
// Node server details
var appEnv = cfenv.getAppEnv();
var port = appEnv.port || "8000";
var routeUrl = appEnv.bind || "localhost";
var appName = appEnv.name || "orders";
var serverdomain = process.env.serverdomain || "mybluemix.net";
var hostName = appName + "." + serverdomain;

var config = require("./config.json");
var logger = require("bunyan").createLogger({
	name: config.APP_NAME,
	level: config.LOG_LEVEL
});



// Bind mongodb connection
var mongoUrl = appEnv.getServiceURL("orders-db");
//var mongoService = appEnv.getService('kaiser-project-mongodb');
//console.log('mongoUrl:'+ mongoUrl);
//console.log('mongoService:'+ mongoService);


var mongoose = require("mongoose");
var cors = require("cors");

if (mongoUrl == null) {
	//local development
	mongoose.Promise = global.Promise;
	//mongoose.connect('mongodb://localhost/project');
	//Mocha test
	if (process.env.ENV == "Test") {
		mongoose.connect("mongodb://localhost/orders_test");
	} else {
		mongoose.connect("mongodb://localhost/orders");
	}
} else {
	//Bluemix cloud foundry - Compose service connection
	//var mongooseUrl = 'mongodb://' + mongoService.credentials.username + ':' + mongoService.credentials.password + '@' + mongoService.credentials.uri + ':' + mongoService.credentials.port + '/project'

	//URI Incompatibility in Compose mongodb service versions
	//var mongooseUrl = mongoService.credentials.url;
	//mongooseUrl = mongooseUrl.replace('/db', '/project');

	mongoose.Promise = global.Promise;
	//mongoose.connect(mongooseUrl);
	mongoose.connect(mongoUrl, function (err) {
		if (err) {
			logger.info("ERROR connecting to: " + mongoUrl + ". " + err);
		} else {
			logger.info("Succeeded connected ");
		}
	});

}

// enables CORS on preflight requests
app.options("*", cors());
// enables CORS on all other requests
app.use("/", cors());

//JSON body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
app.use(function (req, res, next) {
	if (req.secure || req.headers.host.includes("localhost")) {
		// request was via https, so do no special handling
		next();
	} else {
		// request was via http, so redirect to https
		res.redirect("https://" + req.headers.host + req.url);
	}
});

// For index.html
app.use(express.static(path.join(__dirname, "www")));

//orders route
require("./routes/orders.js")(app);

// start server on the specified port and binding host
app.listen(port, routeUrl, function () {
	logger.info("Gulp server starting on " + routeUrl + ":" + port);
});

//export app for supertest
module.exports = app;

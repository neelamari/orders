//var dbJs = require('./db.js');

var mongoose = require("mongoose");

//Schema for orders
var ordersSchema = mongoose.Schema({
		customer: String,
		product: String,
		units: String,
		cost: String, 	
		tracking_number: String,
		tracking_status: String, 
});

module.exports = mongoose.model("orders", ordersSchema);

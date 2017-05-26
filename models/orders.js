//var dbJs = require('./db.js');

var mongoose = require("mongoose");

//Schema for orders
var ordersSchema = mongoose.Schema({
	name: String,
	shipping: {
		customer: String,
		address: String,
		city: String,
		state: String,
		country: String,
		delivery_notes: String,
	},
	tracking: {
		company: String,
		tracking_number: String,
		status: String,
	},
	payment: {
		method: String,
		transaction_number: String
	},
	products: {
		quantity: String,
		product_id: String,
		name: String,
		cost: String,
		units: String
	}
});

ordersSchema.index({ "$**": "text" }); //For generic text search
module.exports = mongoose.model("orders", ordersSchema);

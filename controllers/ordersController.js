var _ = require("lodash");
require("request");
var config = require("../config.json");
var logger = require("bunyan").createLogger({
	name: config.APP_NAME,
	level: config.LOG_LEVEL
});

var ordersController = function (orders) {

	//Creation of new orders	
	var post = function (req, res) {
		logger.info("Entering orders post method");

			var orders = [];
			if (req.body["orders"] !== undefined) {
				orders = req.body["orders"];
			} else {
				orders.push(req.body);
			}
			orders.create(orders, function (err, orders) {
				if (err) {
					logger.error("Error in posting orders" + err);
					res.status(500);
					res.json({ info: "error when posting orders", error: err });
				} else {
					logger.info("Exiting orders post method");
					res.status(201);
					res.send(orders);
				}
			});
	};

	//Get orders. If the group is 'Submitter', get those orders submitted by the user. Else, get all orders.	
	var get = function (req, res) {
		logger.info("Entering orders get method");

		orders.find(function (err, orders) {
			if (err) {
				logger.error("Error in getting orders" + err);
				res.status(500);
				res.json({ info: "error during find orders", error: err });
			} else {
				logger.info("Exiting orders get method");
				res.status(200);
				res.send(orders);
			}
		});

	};

	//Get orders by Id. If the user is 'Submitter' check if the orders can be shown as well.	
	var getbyId = function (req, res) {
		logger.info("Entering orders getbyid method");

		orders.findById(req.params.id, function (err, orders) {
			if (err) {
				logger.error("Error in getting orders" + err);
				res.status(500);
				res.json({ info: "error during find orders", error: err });
			}
			if (orders) {
				logger.info("Exiting orders get method");
				res.status(200);
				res.send(orders);
			} else {
				logger.info("Exiting orders get method");
				res.status(200);
				res.json({ info: "orders not found" });
			}
		});

	};

	//Editing the orders. If the user is 'Submitter', Assessment section is not allowed to edit.
	var put = function (req, res) {
		logger.info("Entering orders put method");

		orders.findById(req.params.id, function (err, orders) {
			if (err) {
				logger.error("Error in getting orders" + err);
				res.status(500);
				res.json({ info: "error during find orders", error: err });
			}
			if (orders) {
				if (req.body.options) {
					orders.options = req.body.options;
				}
				_.merge(orders, req.body);
				orders.save(function (err) {
					if (err) {
						logger.info("Exiting upating orders put method");
						res.status(500);
						res.json({ info: "error during find orders", error: err });
					} else {
						logger.info("Updated orders successfully");
						res.status(200);
						res.send(orders);
					}
				});
			} else {
				logger.info("Exiting orders get method");
				res.status(200);
				res.json({ info: "orders not found" });
			}
		});

	};

	//Removal of orders	
	var remove = function (req, res) {
		logger.info("Entering orders remove method");
		
		orders.findByIdAndRemove(req.params.id, function (err, orders) {
			if (err) {
				logger.error("Error in getting orders" + err);
				res.status(500);
				res.json({ info: "error during find orders", error: err });
			} else {
				if (orders) {
					logger.info("Exiting orders remove method");
					res.status(200);
					res.json({ info: "orders Removed Successfully" });
				} else {
					logger.info("orders not found");
					res.status(200);
					res.send(orders);
				}
			}
		});

	};

	return {
		post: post,
		get: get,
		getbyId: getbyId,
		put: put,
		remove: remove
	};
};

module.exports = ordersController;

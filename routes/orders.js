var Orders = require("../models/orders.js");

module.exports = function (app) {

	var ordersController = require("../controllers/ordersController")(Orders);

	/* Create */
	app.post("/orders", ordersController.post);

	/* Read */
	app.get("/orders", ordersController.get);

	app.get("/orders/:id", ordersController.getbyId);

	/* Update */
	app.put("/orders/:id", ordersController.put);

	/* Delete */
	app.delete("/orders/:id", ordersController.remove);


};

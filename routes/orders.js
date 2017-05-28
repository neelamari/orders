var _ = require('lodash');
var Order = require('../models/orders.js');

module.exports = function(app) {

    /* Create */
    app.post('/orders', function (req, res) {
        var newOrder = new Order(req.body);
        newOrder.save(function(err) {
            if (err) {
				res.status(500);
                res.json({info: 'error during orders create', error: err});
            };
			res.status(201);
			res.send(newOrder);			
            //res.json({info: 'orders created successfully'});
        });
    });

    /* Read */
    app.get('/orders', function (req, res) {
        Order.find(function(err, orders) {
            if (err) {
                res.status(500);
				res.json({info: 'error during find orders', error: err});
            };
			res.status(200);
			res.send(orders);	
            //res.json({info: 'orders found successfully', data: orders});
        });
    });

    app.get('/orders/:id', function (req, res) {
        Order.findById(req.params.id, function(err, orders) {
            if (err) {
				res.status(500);
                res.json({info: 'error during find orders', error: err});
            };
            if (orders) {
				res.status(200);
				res.send(orders);
                //res.json({info: 'orders found successfully', data: orders});
            } else {
				res.status(404);
                res.json({info: 'orders not found'});
            }
        });
    });

    /* Update */
    app.put('/orders/:id', function (req, res) {
        Order.findById(req.params.id, function(err, orders) {
            if (err) {
				res.status(500);
                res.json({info: 'error during find orders', error: err});
            };
            if (orders) {
                _.merge(orders, req.body);
                orders.save(function(err) {
                    if (err) {
						res.status(500);
                        res.json({info: 'error during orders update', error: err});
                    } else {
						res.status(201);
						res.send(orders);
	                    //res.json({info: 'orders updated successfully'});
					}
                });
            } else {
				res.status(401);
                res.json({info: 'orders not found'});
            }

        });
    });

    /* Delete */
    app.delete('/orders/:id', function (req, res) {
        /** 
		Order.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
				res.status(404);
                res.json({info: 'error during remove Order', error: err});
            };
            res.json({info: 'Order removed successfully'});
        });
		*/
		Order.findByIdAndRemove(req.params.id, function(err, orders) {
			if (err) {
				res.status(404);
				res.send('orders not found');        
			}else{
				if(orders){
					res.status(200);
					res.json({info: 'orders Removed Successfully'});	
				}else{
					res.status(404);
					res.send('orders not found');
				} 
			}
		});

    });

};

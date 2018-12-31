const SubscriptionPlan = require('../models/subscription-plans.model');
const User = require('../models/user.model');
const Subscriber = require('../models/subscribers.model');
const Subscription = require('../models/subscriptions.model');
const Auction = require('../models/auction.model');
var mongoose = require('mongoose');

const nodemailer =  require('nodemailer'); 
const smtpTransport =  require('nodemailer-smtp-transport');

var Mailclient = nodemailer.createTransport(smtpTransport({  
    host : "smtp.gmail.com",
    secureConnection : false,
    port: 587,
    auth: {  
      user: 'rupak@avainfotech.com',
      pass: 'future@1234'  
    }
  })); 

var paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', // Sandbox or live
  client_id: 'ARcbdH1LHy3lWkRkCkXUlE0ZP6zwhqWAPI3isX6wV-zc9DUlGugmCfFOs_crpk5boPVk0ANZTAwvBZTa',
  client_secret: 'EHHn_rOpdjnT7M-u1Zt03PaTa5Lt8eK4la-lv9gI43uKDqczAoG3TScjZa_9mlE8nQkaCu4_F0NJGvcA'
});

exports.paypal_cc_payment = function(req, res){

  var expiry_date = req.body.expire_date.split('-');


  SubscriptionPlan.findOne({'_id': req.body.plan_id}, function(err, plan) {
    if(!err){
      if(plan != null){
        var create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "credit_card",
              "funding_instruments": [{
                  "credit_card": {
                      "type": req.body.card_type,
                      "number": req.body.card_number,
                      "expire_month": expiry_date[1],
                      "expire_year": expiry_date[0],
                      "cvv2": req.body.cvv2,
                      "first_name": req.body.current_user.firstname,
                      "last_name": req.body.current_user.lastname,
                      "billing_address": {
                          "line1": "52 N Main ST",
                          "city": "Johnstown",
                          "state": "OH",
                          "postal_code": "43210",
                          "country_code": "US"
                      }
                  }
              }]
          },
          "transactions": [{
              "amount": {
                  "total": plan.cost,
                  "currency": "USD",
                  "details": {
                      "subtotal": plan.cost,
                      "tax": "0",
                      "shipping": "0"
                  }
              },
              "description": "Subscription plan"
          }]
        };
      
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
              res.json({status:false, type: 'validation', data: error});
            } else {
      
              paypal.payment.get(payment.id, function (error, payment1) {
                if (error) {
                  res.json({status:false, type: 'payment', data: error});
                } else {

                  User.findById(req.body.current_user.id, function(err, user){

                    user.subscribed = '1';
                    user.startdate = new Date();
                    user.enddate = new Date(new Date().setDate(new Date().getDate() - 7));

                    if(plan.duration == 'week'){
                      var plusdays = 7;
                    }else if(plan.duration == 'month'){
                      var plusdays = 30;
                    }else if(plan.duration == 'year'){
                      var plusdays = 365;
                    }

                    var subscription = {
                      title: plan.title,
                      cost: plan.cost,
                      plan_id: plan._id,
                      startdate: new Date(),
                      enddate: new Date(new Date().setDate(new Date().getDate() - plusdays)),
                      transaction_id: payment1.id,
                      payment_type: 'paypal_credit_card'
                    }

                    user.subscriptions.push(subscription);

                    user.save(function(err){
                      res.json({status:true, data: payment1});
                    })

                  });
                }
              });
            }
        });
      }else{
        res.json({ status: false, type: 'subscription', message: 'Error in subscribing!'})
      }
    }else{
      res.json({ status: false, message: 'An error occurs. Try again later!'});
    }
  });

}

exports.paypal = function(req, res){
  
  SubscriptionPlan.findOne({'_id': req.body.plan_id}, function(err, plan) {
    if(!err){
      if(plan != null){
        
        var create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": req.body.baseurl + "/sprofile/subscription-success?plan=" + plan._id + "&userid=" + req.body.current_user.id + "&cost=" + plan.cost ,
              "cancel_url": req.body.baseurl + "/sprofile/subscription-cancel"
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                    "name": plan.title,
                    "sku": plan.title,
                    "price": plan.cost,
                    "currency": "USD",
                    "quantity": 1
                }]
              },
              "amount": {
                  "currency": "USD",
                  "total": plan.cost
              },
              "description": "Subscription plan payment"
          }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
              res.json({ status: false, message: error.response});
            } else {
              res.json({ status: true, message: 'Redirecting..', data: payment});
            }
        });

      }else{
        res.json({ status: false, type: 'subscription', message: 'Error in subscribing!'})
      }
    }else{
      res.json({ status: false, message: 'An error occurs. Try again later!'});
    }
  });

}

exports.paypal_execute = function(req, res){

  var payerId = req.body.PayerID;
	var paymentId = req.body.paymentId;
	var paymentprice = req.body.cost;
	var execute_payment_json = {
	    "payer_id": payerId,
	    "transactions": [{
	        "amount": {
	            "currency": "USD",
	            "total": paymentprice
	        }
	    }]
	};
	paypal.payment.execute(paymentId,execute_payment_json, function (error, payment) {
	    if (error) {
        res.json({ status: false, message: error.response.message});
	    } else {
        SubscriptionPlan.findOne({'_id': req.body.plan}, function(err, plan) {
          if(!err){
            if(plan != null){
              User.findById(req.body.userid, function(err, user){

                user.subscribed = '1';
                user.startdate = new Date();
                user.enddate = new Date(new Date().setDate(new Date().getDate() - 7));

                if(plan.duration == 'week'){
                  var plusdays = 7;
                }else if(plan.duration == 'month'){
                  var plusdays = 30;
                }else if(plan.duration == 'year'){
                  var plusdays = 365;
                }

                var subscription = {
                  title: plan.title,
                  cost: plan.cost,
                  plan_id: plan._id,
                  startdate: new Date(),
                  enddate: new Date(new Date().setDate(new Date().getDate() - plusdays)),
                  transaction_id: payment.id,
                  payment_type: 'paypal'
                }

                user.subscriptions.push(subscription);

                user.save(function(err){
                  res.json({status:true, data: payment});
                })

              });
            }else{
              res.json({ status: false, type: 'subscription', message: 'Error in subscribing!'})
            } 
          }else{
            res.json({ status: false, message: 'An error occurs. Try again later!'});
          }   
        })  
      }
    });    
}



/**************** Specific channel subscription payments ******************/


exports.paypal_cc_paymenttt = function(req, res){

  var expiry_date = req.body.expire_date.split('-');

  var condition = {
    "$match": {
        "plans._id": mongoose.Types.ObjectId(req.body.plan_id)
    }
  };

  var unwind = {
      "$unwind": "$plans"
  };

  var project = {
      '$project':{
          'plans':1
      }
  };
  
  
  User.aggregate([unwind, condition],  function(err, user){
      if (err){
         res.json({ status: false, message: 'Server error occurs. Please try again later!' });
      }else{
        if(user.length > 0){
          var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "credit_card",
                "funding_instruments": [{
                    "credit_card": {
                        "type": req.body.card_type,
                        "number": req.body.card_number,
                        "expire_month": expiry_date[1],
                        "expire_year": expiry_date[0],
                        "cvv2": req.body.cvv2,
                        "first_name": req.body.current_user.firstname,
                        "last_name": req.body.current_user.lastname,
                        "billing_address": {
                            "line1": "52 N Main ST",
                            "city": "Johnstown",
                            "state": "OH",
                            "postal_code": "43210",
                            "country_code": "US"
                        }
                    }
                }]
            },
            "transactions": [{
                "amount": {
                    "total": user[0].plans.cost,
                    "currency": "USD",
                    "details": {
                        "subtotal": user[0].plans.cost,
                        "tax": "0",
                        "shipping": "0"
                    }
                },
                "description": "Subscription plan"
            }]
          };
        
          paypal.payment.create(create_payment_json, function (error, payment) {
              if (error) {
                res.json({status:false, type: 'validation', data: error});
              } else {
        
                paypal.payment.get(payment.id, function (error, payment1) {
                  if (error) {
                    res.json({status:false, type: 'payment', data: error});
                  } else {

                    if(user[0].plans.duration == 'week'){
                      var plusdays = 7;
                    }else if(user[0].plans.duration == 'month'){
                      var plusdays = 30;
                    }else if(user[0].plans.duration == 'year'){
                      var plusdays = 365;
                    }

                    /**********/

                    var new_subscription = new Subscription({
                      plan: user[0].plans.title,
                      channel_id: user[0]._id,
                      user_id: req.body.current_user._id,
                      startdate: new Date(),
                      enddate: new Date(new Date().setDate(new Date().getDate() + plusdays)),
                      transaction_id: payment1.id,
                      payment_type: 'paypal credit card',
                      cost: payment1.transactions[0].amount.total
                    });
                    
                    new_subscription.save();

                    /**********/

                    var new_subscriber = new Subscriber({
                      plan: user[0].plans.title,
                      channel_id: user[0]._id,
                      user_id: req.body.current_user._id,
                      startdate: new Date(),
                      enddate: new Date(new Date().setDate(new Date().getDate() + plusdays)),
                      transaction_id: payment1.id,
                      payment_type: 'paypal credit card',
                      cost: payment1.transactions[0].amount.total
                    });
                    
                    new_subscriber.save();

                     res.json({status:true, data: payment1});
                    
                  }
                });
              }
          });
        }else{
          res.json({ status: false, message: 'No photos found!' });
        }
      }
  });


  

}

exports.paypal2 = function(req, res){


  var condition = {
    "$match": {
        "plans._id": mongoose.Types.ObjectId(req.body.plan_id)
    }
  };

  var unwind = {
      "$unwind": "$plans"
  };

  var project = {
      '$project':{
          'plans':1
      }
  };
  
  
  User.aggregate([unwind, condition],  function(err, user){
      if (err){
         res.json({ status: false, message: 'Server error occurs. Please try again later!' });
      }else{
        if(user.length > 0){
            var create_payment_json = {
              "intent": "sale",
              "payer": {
                  "payment_method": "paypal"
              },
              "redirect_urls": {
                  "return_url": req.body.baseurl + "/subscription-status?plan=" + user[0].plans._id + "&userid=" + req.body.current_user._id + "&cost=" + user[0].plans.cost ,
                  "cancel_url": req.body.baseurl + "/subscription-status"
              },
              "transactions": [{
                  "item_list": {
                      "items": [{
                        "name": user[0].plans.title,
                        "sku": user[0].plans.title,
                        "price": user[0].plans.cost,
                        "currency": "USD",
                        "quantity": 1
                    }]
                  },
                  "amount": {
                      "currency": "USD",
                      "total": user[0].plans.cost
                  },
                  "description": "Subscription plan payment"
              }]
            };
    
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                  res.json({ status: false, message: error.response});
                } else {
                  res.json({ status: true, message: 'Redirecting..', data: payment});
                }
            });
    
          }else{
            res.json({ status: false, type: 'subscription', message: 'Error in subscribing!'})
          }
        }
      }
  );  

}

exports.paypal_execute2 = function(req, res){

  var payerId = req.body.PayerID;
	var paymentId = req.body.paymentId;
	var paymentprice = req.body.cost;
	var execute_payment_json = {
	    "payer_id": payerId,
	    "transactions": [{
	        "amount": {
	            "currency": "USD",
	            "total": paymentprice
	        }
	    }]
  };
  
  var condition = {
    "$match": {
        "plans._id": mongoose.Types.ObjectId(req.body.plan)
    }
  };

  var unwind = {
      "$unwind": "$plans"
  };

  var project = {
      '$project':{
          'plans':1
      }
  };
  
	paypal.payment.execute(paymentId,execute_payment_json, function (error, payment) {
	    if (error) {
        res.json({ status: false, message: error.response.message});
	    } else {
        User.aggregate([unwind, condition],  function(err, user1){
          if (err){
            res.json({ status: false, message: 'Server error occurs. Please try again later!' });
         }else{
            if(user1.length > 0){

              var plan = user1[0].plans;
          
              User.findById(req.body.userid, function(err, user){

                if(plan.duration == 'week'){
                  var plusdays = 7;
                }else if(plan.duration == 'month'){
                  var plusdays = 30;
                }else if(plan.duration == 'year'){
                  var plusdays = 365;
                }

                /**********/

                var new_subscription = new Subscription({
                  plan: plan.title,
                  channel_id: user1[0]._id,
                  user_id: req.body.userid,
                  startdate: new Date(),
                  enddate: new Date(new Date().setDate(new Date().getDate() + plusdays)),
                  transaction_id: payment.id,
                  payment_type: 'paypal',
                  cost: payment.transactions[0].amount.total
                });
                
                new_subscription.save(function(err){
                  console.log(err);
                });

                /**********/

                var new_subscriber = new Subscriber({
                  plan: plan.title,
                  channel_id: user1[0]._id,
                  user_id: req.body.userid,
                  startdate: new Date(),
                  enddate: new Date(new Date().setDate(new Date().getDate() + plusdays)),
                  transaction_id: payment.id,
                  payment_type: 'paypal',
                  cost: payment.transactions[0].amount.total
                });
                
                new_subscriber.save(function(err){
                  console.log(err);
                });

                res.json({status:true, data: payment});

              });
            }else{
              res.json({ status: false, type: 'subscription', message: 'Error in subscribing!'})
            }  
          } 
        })  
      }
    });    
}



/**************** Auction payments ******************/


exports.auction_paypal_cc_payment = function(req, res){

  Auction.findOne({ _id: req.body.auction_id }, function(err, auction){
    if(err){
      res.json({ status:false, type: 'payment', message: "Server error occurs. Please try again later!" });
    }else{
      if(auction != null){

        if(auction.status == 0){
          res.json({ status:false, type: 'payment', message: "This auction has been suspended." });
        }else if(auction.status == 2){
          res.json({ status:false, type: 'payment', message: "Payment is already been made for this auction" });
        }else{
          var expiry_date = req.body.expire_date.split('-');

          var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "credit_card",
                "funding_instruments": [{
                    "credit_card": {
                        "type": req.body.card_type,
                        "number": req.body.card_number,
                        "expire_month": expiry_date[1],
                        "expire_year": expiry_date[0],
                        "cvv2": req.body.cvv2,
                        "first_name": req.body.firstname,
                        "last_name": req.body.lastname,
                        "billing_address": {
                            "line1": "52 N Main ST",
                            "city": "Johnstown",
                            "state": "OH",
                            "postal_code": "43210",
                            "country_code": "US"
                        }
                    }
                }]
            },
            "transactions": [{
                "amount": {
                    "total": req.body.price,
                    "currency": "USD",
                    "details": {
                        "subtotal": req.body.price,
                        "tax": "0",
                        "shipping": "0"
                    }
                },
                "description": "Auction bid payment"
            }]
          };
          
          paypal.payment.create(create_payment_json, function (error, payment) {
              if (error) {
                res.json({status:false, type: 'validation', data: error});
              } else {
          
                paypal.payment.get(payment.id, function (error, payment1) {
                  if (error) {
                    res.json({ status:false, type: 'payment', message: "Server error occurs. Please try again later!" });
                  } else {
                    
                      auction.status = 2;
                      auction.payment_mode = 'paypal credit card';
                      auction.transaction_id = payment1.id;
                      auction.transaction_date = new Date();
                      auction.sold_price = payment1.transactions[0].amount.total;
                      auction.winner = req.body.user_id;

                      var file = auction.file;

                    auction.save(function(err){
                      if(err){
                        res.json({ status:false, type: 'payment', message: "Server error occurs. Please try again later!" });
                      }else{

                        var mailOptions = {  
                            from: 'gurpreet@avainfotech.com',
                            to: req.body.email,
                            subject: 'Auction Won', 
                            html: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Forgot Password</title><link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500" rel="stylesheet"></head><body style="padding:15px 0; background: url(img/bgplait.png) repeat #dddddd; margin:0px auto; font-family: "Roboto", sans-serif; font-weight:400; background-size: 160px;"><table width="600" border="0" cellpadding="10" cellspacing="0" style="margin:0px auto; background:#fffefb; text-align:center;"><tr style="background:#fff;" ><td style="text-align:center; padding-top:10px; padding-bottom:10px; border-bottom:2px solid #00306b;">My Model Connection</td></tr><tr><td align="center"><h2 style="text-align:center;">Hi, '+req.body.firstname+'</h2><h3 style="margin-top:0 ;font-weight: 600; font-size: 18px;">Congratulations, Auction payment successfull.</h3><p>To download the file you have to click below link:</p> <a href="'+file+'">Download File</a></td></tr></table></body></html>'
                        };

                        Mailclient.sendMail(mailOptions); 

                        res.json({ status:true, message: "Auction payment made successfully!", data: payment1 });
                      }
                    });
                    
                  }
                });
              }
          });
        }

      }else{
        res.json({ status:false, type: 'payment', data: "Server error occurs. Please try again later!" });
      }
    }
  })
  

}

exports.auction_paypal = function(req, res){


  Auction.findOne({ _id: req.body.auction_id }, function(err, auction){
    if(err){
      res.json({ status:false, message: "Server error occurs. Please try again later!" });
    }else{
      if(auction != null){

        if(auction.status == 0){
          res.json({ status:false, message: "This auction has been suspended." });
        }else if(auction.status == 2){
          res.json({ status:false, message: "Payment is already been made for this auction" });
        }else{
          var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": req.body.baseurl + "/auction-payment-status?auction=" + req.body.auction_id + "&cost=" + auction.price  + "&user_id=" + req.body.user_id ,
                "cancel_url": req.body.baseurl + "/auction-payment-status"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                      "name": auction.title,
                      "sku": auction.title,
                      "price": auction.price,
                      "currency": "USD",
                      "quantity": 1
                  }]
                },
                "amount": {
                    "currency": "USD",
                    "total": auction.price
                },
                "description": "Auction bid payment"
            }]
          };
  
          paypal.payment.create(create_payment_json, function (error, payment) {
              if (error) {
                res.json({ status: false, message: error.response});
              } else {
                res.json({ status: true, message: 'Redirecting..', data: payment});
              }
          });
        }
      }
    }
  });

}

exports.auction_paypal_execute = function(req, res){

  var payerId = req.body.PayerID;
	var paymentId = req.body.paymentId;
	var paymentprice = req.body.cost;
	var execute_payment_json = {
	    "payer_id": payerId,
	    "transactions": [{
	        "amount": {
	            "currency": "USD",
	            "total": paymentprice
	        }
	    }]
  };

  Auction.findOne({ _id: req.body.auction }, function(err, auction){
    if(err){
      res.json({ status:false, message: "Server error occurs. Please try again later!" });
    }else{
      if(auction != null){

        if(auction.status == 0){
          res.json({ status:false, message: "This auction has been suspended." });
        }else if(auction.status == 2){
          res.json({ status:false, message: "Payment is already been made for this auction" });
        }else{
          paypal.payment.execute(paymentId,execute_payment_json, function (error, payment) {
            if (error) {
              res.json({ status: false, message: error.response.message});
            } else {

              auction.status = 2;
              auction.payment_mode = 'paypal';
              auction.transaction_id = payment.id;
              auction.transaction_date = new Date();
              auction.sold_price = payment.transactions[0].amount.total;
              auction.winner = req.body.user_id;

              var file = auction.file;

              auction.save(function(err){
                if(err){
                  res.json({ status:false, message: "Server error occurs. Please try again later!" });
                }else{

                  var mailOptions = {  
                      from: 'gurpreet@avainfotech.com',
                      to: req.body.email,
                      subject: 'Auction Won', 
                      html: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Forgot Password</title><link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500" rel="stylesheet"></head><body style="padding:15px 0; background: url(img/bgplait.png) repeat #dddddd; margin:0px auto; font-family: "Roboto", sans-serif; font-weight:400; background-size: 160px;"><table width="600" border="0" cellpadding="10" cellspacing="0" style="margin:0px auto; background:#fffefb; text-align:center;"><tr style="background:#fff;" ><td style="text-align:center; padding-top:10px; padding-bottom:10px; border-bottom:2px solid #00306b;">My Model Connection</td></tr><tr><td align="center"><h2 style="text-align:center;">Hi, '+req.body.firstname+'</h2><h3 style="margin-top:0 ;font-weight: 600; font-size: 18px;">Congratulations, Auction payment successfull.</h3><p>To download the file you have to click below link:</p> <a href="'+file+'">Download File</a></td></tr></table></body></html>'
                  };

                  Mailclient.sendMail(mailOptions); 

                  res.json({ status:true, message: "Auction payment made successfully!", data: payment });
                }
              });

            }
          });  
        }
      }
    }
  });
  
  
}


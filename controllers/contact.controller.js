const Contact = require('../models/contact.model');
const User = require('../models/user.model');
var mongoose = require('mongoose');
const nodemailer =  require('nodemailer'); 
const smtpTransport =  require('nodemailer-smtp-transport');
var mongoose = require('mongoose');

var Mailclient = nodemailer.createTransport(smtpTransport({  
  host : "smtp.gmail.com",
  secureConnection : false,
  port: 587,
  auth: {  
    user: 'rupak@avainfotech.com',
    pass: 'future@1234'  
  }
})); 

exports.add = function(req, res){

    var contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    });

    contact.save(function(err){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            res.json({ status: true, message: 'Your query has been sent to admin. please wait for our response!'})

            User.findOne({'role': 'admin'}, function(err, user) {  
                
                if(!err){

                  if(user != null){ 
                    
                   var mailOptions = {  
                    from: user.email,
                    to: user.email,
                    subject: 'Contact Us', 
                    html: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Forgot Password</title><link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500" rel="stylesheet"></head><body style="padding:15px 0; background: url(img/bgplait.png) repeat #dddddd; margin:0px auto; font-family: "Roboto", sans-serif; font-weight:400; background-size: 160px;"><table width="600" border="0" cellpadding="10" cellspacing="0" style="margin:0px auto; background:#fffefb; text-align:center;"><tr style="background:#fff;" ><td style="text-align:center; padding-top:10px; padding-bottom:10px; border-bottom:2px solid #00306b;">My Model connection</td></tr><tr><td align="center"><h2 style="text-align:center;">Hi, Admin</h2><h3 style="margin-top:0 ;font-weight: 600; font-size: 18px;">A new query has been recieved from '+ req.body.email + '</h3></td></tr></table><table style="margin:0px auto;background:#fffefb;text-align:center;"><tr><td>Name</td><td>'+ req.body.name +'</td></tr><tr><td>Email</td><td>'+ req.body.email +'</td></tr><tr><td>Subject</td><td>'+ req.body.subject +'</td></tr><tr><td>Message</td><td>'+ req.body.message +'</td></tr></table></body></html>'
                  };
                  
                  Mailclient.sendMail(mailOptions, function(error, info) { }); 
                  
                }
              }
            });

        }
    });

}

exports.list = function(req, res){

    Contact.find({}, function(err, contacts){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            res.json({ status: true, message: 'Contacts Found!', data: contacts})
        }
    }).sort( { createdAt: -1 } );

}

exports.get = function(req, res){

    Contact.findById(req.params.id, function(err, contact){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            if(contact != null){
                res.json({ status: true, message: 'Contact Found', data: contact})
            }else{
                res.json({ status: false, message: 'Server error occurred! Try again', error: err })
            }
        }
    });
    
}

exports.edit = function(req, res){

    Contact.findById(req.body.id, function(err, contact){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            if(contact != null){

                contact.name = req.body.name;
                contact.subject = req.body.subject;
                contact.message = req.body.message;
                contact.reply = req.body.reply;

                contact.save(function(err){
                    if(err){
                        res.json({ status: false, message: 'Server error occurred! Try again', error: err })
                    }else{

                        User.findOne({'role': 'admin'}, function(err, user) {  
                
                            if(!err){
            
                              if(user != null){ 

                                var mailOptions = {  
                                    from: user.email,
                                    to: req.body.email,
                                    subject: 'Contact Us', 
                                    html: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Forgot Password</title><link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500" rel="stylesheet"></head><body style="padding:15px 0; background: url(img/bgplait.png) repeat #dddddd; margin:0px auto; font-family: "Roboto", sans-serif; font-weight:400; background-size: 160px;"><table width="600" border="0" cellpadding="10" cellspacing="0" style="margin:0px auto; background:#fffefb; text-align:center;"><tr style="background:#fff;" ><td style="text-align:center; padding-top:10px; padding-bottom:10px; border-bottom:2px solid #00306b;">My Model connection</td></tr><tr><td align="center"><h2 style="text-align:center;">Hi, '+req.body.name+'</h2><h3 style="margin-top:0 ;font-weight: 600; font-size: 18px;">A new query has been recieved from '+ req.body.email + '</h3></td></tr></table><table style="margin:0px auto;background:#fffefb;text-align:center;"><tr><td>Name</td><td>'+ req.body.name +'</td></tr><tr><td>Subject</td><td>'+ req.body.subject +'</td></tr><tr><td>Message</td><td>'+ req.body.message +'</td></tr><tr><td>Reply</td><td>'+ req.body.reply +'</td></tr></table></body></html>'
                                };
                                
                                Mailclient.sendMail(mailOptions, function(error, info) { });
                            }
                        }
                    }); 

                        res.json({ status: true, message: 'Reply has been sent successfully!', data: contact})
                    }
                });


            }else{
                res.json({ status: false, message: 'Server error occurred! Try again', error: err })
            }
        }
    });

}

exports.delete = function(req, res){

    Contact.findByIdAndRemove(req.body.id, function (err, contact) {
        if(err){
            res.json({status: false, message: 'Error in deleting contact. Try again later!'});
        }else{
            if(contact != null){
                res.json({status: true, message: 'Contact deleted successfully!', data: contact});
            }else{
                res.json({status: false, message: 'Error in deleting contact. Try again later!'});
            }
        }
    });

}
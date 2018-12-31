const User = require('../models/user.model');
const Auction = require('../models/auction.model');
var mongoose = require('mongoose');
const nodemailer =  require('nodemailer'); 
const smtpTransport =  require('nodemailer-smtp-transport');
var schedule = require('node-schedule');

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

    User.findById(req.body.user_id, function(err, user) {
        if(!err){
            if(user != null){
                var new_auction = new Auction(req.body);
                  
                new_auction.save(function(err){
                    if(err){
                      console.log(err);
                        res.json({ status:false, message: err });
                    }else{
                        res.json({ status:true, message: 'Auction data added successsfully!' });
                    }
                  });
            }else{
            res.json({ status:false, message: 'Server error occurred! Try again!' });
            }
        }else{
            res.json({ status:false, message: 'Server error occurred! Try again' });
        }
    });  

}

exports.list = function(req, res){

    


    Auction.aggregate([  
        {
        $lookup: {
            "from": "users",
            "localField": "user_id",
            "foreignField": "_id",
            "as": "user"
        }
        },
        {$unwind:"$user"},
        {
            $sort: {
                "createdAt": -1
            }
        }
    ], function(err, auctions){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auctions.length > 0){
                res.json({ status:true, message: 'Found!', data: auctions });
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    })
}

exports.channelAuctions = function(req, res){

    Auction.find({"user_id": mongoose.Types.ObjectId(req.body.id)}, function(err, auctions){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auctions.length > 0){
                res.json({ status:true, message: 'Found!', data: auctions });
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    })
}

exports.channelFrontAuctions = function(req, res){

    Auction.find(
        {
            "user_id": mongoose.Types.ObjectId(req.body.id),
            end_date: {
                $gte: new Date()
            },
            start_date: {
                $lte: new Date()
            }
        }
        , function(err, auctions){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auctions.length > 0){
                res.json({ status:true, message: 'Found!', data: auctions });
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    })

}

exports.channelFrontAuctionPhotos = function(req, res){

    Auction.find(
        {
            "user_id": mongoose.Types.ObjectId(req.body.id),
            end_date: {
                $gte: new Date()
            },
            start_date: {
                $lte: new Date()
            },
            "type": "image"
        }, function(err, auctions){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auctions.length > 0){
                res.json({ status:true, message: 'Found!', data: auctions });
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    });

}

exports.channelFrontAuctionVideos = function(req, res){

    Auction.find(
        {
            "user_id": mongoose.Types.ObjectId(req.body.id),
            end_date: {
                $gte: new Date()
            },
            start_date: {
                $lte: new Date()
            },
            "type": "video"
        }, function(err, auctions){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auctions.length > 0){
                res.json({ status:true, message: 'Found!', data: auctions });
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    })

}


exports.getAuction = function(req, res){

    Auction.findOne(
        {
            "_id": mongoose.Types.ObjectId(req.body.id),
            end_date: {
                $gte: new Date()
            },
            start_date: {
                $lte: new Date()
            },
            "status": 1
        }, 
        function(err, auction){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auction != null){

                res.json({ status:true, message: 'Found!', data: auction });
                
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    })

}

exports.getExpiredAuction = function(req, res){

    Auction.findOne(
        {
            "_id": mongoose.Types.ObjectId(req.body.id)
        }, 
        function(err, auction){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auction != null){

                res.json({ status:true, message: 'Found!', data: auction });
                
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    })

}

exports.getAuctionBids = function(req, res){
    Auction.aggregate([
        {
            "$match": 
            { 
                "$and": [ 
                    {"_id": mongoose.Types.ObjectId(req.body.id)},
                    // {"end_date": {"$gte": new Date()}},
                    // {"start_date": {"$lte": new Date()}},
                    // {"status": 1}
                ]
            }
        },
        { "$unwind": "$bids" },
        {
            $lookup: {
              "from": "users",
              "localField": "bids.user_id",
              "foreignField": "_id",
              "as": "user"
            }
          },
          
        {
            "$sort": {
                "bids.price": -1
            }
        },
        {
            '$project':{

                'bids':1,
                'user.firstname': 1,
                'user.lastname': 1
            }
        }
    ],
    function(err, bids){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(bids.length > 0){

                res.json({ status:true, message: 'Found!', data: bids });
                
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    }
);
}

exports.getExpiredAuctionBids = function(req, res){
    Auction.aggregate([
        {
            "$match": 
            { 
                "$and": [ 
                    {"_id": mongoose.Types.ObjectId(req.body.id)}
                ]
            }
        },
        { "$unwind": "$bids" },
        {
            $lookup: {
              "from": "users",
              "localField": "bids.user_id",
              "foreignField": "_id",
              "as": "user"
            }
          },
          
        {
            "$sort": {
                "bids.price": -1
            }
        },
        {
            '$project':{

                'bids':1,
                'user.firstname': 1,
                'user.lastname': 1
            }
        }
    ],
    function(err, bids){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(bids.length > 0){

                res.json({ status:true, message: 'Found!', data: bids });
                
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    }
);
}

exports.createBid = function(req, res){

    Auction.findOne({ "_id": req.body.auction_id, "status": 1 }, function(err, auction){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auction != null){

                auction.bids.push(req.body);

                auction.save(function(err){
                    if(err){
                        res.json({ status:false, message: 'Server error occurred! Try again!' });
                    }else{
                        res.json({ status:true, message: 'Bid Successfully created!' });
                    }
                })
            }else{
                res.json({ status:false, message: 'This auction has been completed!' });
            }
        }
    })

}

schedule.scheduleJob('0	0 *	* *', function(){
//exports.announceWinner = function(req, res){
    Auction.find(
        {
            "status2": 1,
            "end_date": {
                $lte: new Date()
            }
        }, 
        function(err, auctions){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again 1!' });
        }else{
            if(auctions.length > 0){

                for(var i = 0; i < auctions.length; i++){
                    var auction_id = auctions[i]._id;
                    Auction.aggregate([
                        {
                            "$match": 
                            { 
                                "$and": [ 
                                    {"_id": mongoose.Types.ObjectId(auctions[i]._id)},
                                    {"status": 1}
                                ]
                            }
                        },
                        { "$unwind": "$bids" },
                        {
                            $lookup: {
                              "from": "users",
                              "localField": "bids.user_id",
                              "foreignField": "_id",
                              "as": "user"
                            }
                          },
                          
                        {
                            "$sort": {
                                "bids.price": -1
                            }
                        },
                        {
                            '$project':{
                
                                'bids':1,
                                'user._id':1,
                                'user.email': 1,
                                'user.firstname':1,
                                'user.lastname': 1
                            }
                        }
                        ],
                        function(err, bids){
                            if(err){
                                res.json({ status:false, message: 'Server error occurred! Try again 2!' });
                            }else{
                                if(bids.length > 0){
                    
                                    var highest_bid = bids[0].bids;
                                    var highest_bidder = bids[0].user[0];

                                    Auction.findOne({_id: auction_id}, function(err, auct){
                                        if(err){
                                            res.json({ status:false, message: 'Server error occurred! Try again 3!' });
                                        }else{
                                            if(auct != null){
                                                auct.status = 1;
                                                auct.status2 = 0;
                                                auct.save(function(err){
                                                    if(err){
                                                        res.json({ status:false, message: 'Server error occurred! Try again 4!' });
                                                    }else{
                                                        Auction.findOneAndUpdate(
                                                            {
                                                                'bids._id' : highest_bid._id
                                                            }, 
                                                            {
                                                                $set : { 
                                                                    'bids.$.status': 1
                                                                } 
                                                            },
                                                            { 
                                                                runValidators: true
                                                            }, 
                                                            function(err, bidupdate){
                                                            if (err) {
                                                                 return res.send({ status: false, message: 'Server error occurred! Try again 5!' });
                                                            }else{
                                                                var mailOptions = {  
                                                                    from: 'gurpreet@avainfotech.com',
                                                                    to: highest_bidder.email,
                                                                    subject: 'Auction Won', 
                                                                    html: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Forgot Password</title><link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500" rel="stylesheet"></head><body style="padding:15px 0; background: url(img/bgplait.png) repeat #dddddd; margin:0px auto; font-family: "Roboto", sans-serif; font-weight:400; background-size: 160px;"><table width="600" border="0" cellpadding="10" cellspacing="0" style="margin:0px auto; background:#fffefb; text-align:center;"><tr style="background:#fff;" ><td style="text-align:center; padding-top:10px; padding-bottom:10px; border-bottom:2px solid #00306b;">My Model Connection</td></tr><tr><td align="center"><h2 style="text-align:center;">Hi, '+highest_bidder.firstname+'</h2><h3 style="margin-top:0 ;font-weight: 600; font-size: 18px;">Congratulations, you have won the bid.</h3><p>To download the file you have to make the payment by clicking below link:</p> <a href="http://localhost:4200/auction-payment/'+auction_id+'/'+highest_bidder._id+'">Make Payment</a></td></tr></table></body></html>'
                                                                };

                                                                Mailclient.sendMail(mailOptions, function(error, info) { 
                                                                    if (error) {  
                                                                        res.json({ status: false, message: 'Server error occurred! Try again 6!' });
                                                                    } else {
                                                                        res.json({ status: true, message: 'Email sent' });
                                                                    }
                                                                }); 
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    })
                                    
                                }else{
                                    res.json({ status:false, message: 'Not found 1!' });
                                }
                            }
                        }
                    );
                }
                
            }else{
                res.json({ status:false, message: 'Not found 2!' });
            }
        }
    })

});
//}

exports.getSubscriberAuctions = function(req, res){
    Auction.find(
        {
            "winner": mongoose.Types.ObjectId(req.body.id)
        }
        , function(err, auctions){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auctions.length > 0){
                res.json({ status:true, message: 'Found!', data: auctions });
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    }).sort({ payment_date: -1 })
}


exports.getAuctionData = function(req, res){

    Auction.findOne(
        {
            "_id": mongoose.Types.ObjectId(req.body.id)
        }, 
        function(err, auction){
        if(err){
            res.json({ status:false, message: 'Server error occurred! Try again!' });
        }else{
            if(auction != null){

                res.json({ status:true, message: 'Found!', data: auction });
                
            }else{
                res.json({ status:false, message: 'Not found!' });
            }
        }
    })

}

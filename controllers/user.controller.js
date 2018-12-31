const User = require('../models/user.model');
const Video = require('../models/video-categories.model');
const jwt =  require('jsonwebtoken');
const nodemailer =  require('nodemailer'); 
const smtpTransport =  require('nodemailer-smtp-transport');
var mongoose = require('mongoose');
const Subscriber = require('../models/subscribers.model');
const Subscriptions = require('../models/subscriptions.model');
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

////  REGISTER  ////

exports.list = function(req, res){

  User.find({}, function(err, users) {
    if(err){
      res.json({status: false, message:err});
    }else{
      if(users.length > 0){
        res.json({status: true, message: 'Users found', data: users});
      }else{
        res.json({status: false, message: 'No User found'});
      }
    }
  
  }).sort({createdAt: -1});
}

exports.create = function(req, res){

  User.findOne({'email': req.body.email}, function(err, user) {
    if(!err){
      if(!user){

        var new_user = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          dob: req.body.dob,
          role: req.body.role,
          payment_info: {}
        });

        if(req.body.opentok_session){
          new_user.opentok_session = req.body.opentok_session;
        }
        
        new_user.password = new_user.generateHash(req.body.password);
        
        new_user.save(function(err){
          if(err){
            console.log(err);
              res.json({ status:false, message: err });
          }else{
              res.json({ status:true, message: 'Registeration successsfull!' });
          }
        });

      }else{
        res.json({ status:false, message: 'User with this email ID already exists!' });
      }
    }else{
      res.json({ status:false, message: 'Please try again' });
    }
  });    
  
}

/////   LOGIN   /////

exports.login = function(req, res){
  
  User.findOne({'email': req.body.email, $or: [ { role: 'subscriber' }, { role: 'channel' } ]}, function(err, user) {
    if(!err){
      if(user != null){
        if (user.validPassword(req.body.password)) {
          const token = jwt.sign({username: user.email, id: user._id, role: user.role, firstname: user.firstname, lastname: user.lastname}, 'future@123');
          return res.json({status: true, token: 'JWT ' + token, username: user.email});
        } else {
          res.json({ status: false, message: 'Email and password not matched'})
        }
      }else{
        res.json({ status: false, message: 'Email and password not matched'})
      }
    }
  });

}

exports.adminlogin = function(req, res){
  
  User.findOne({'email': req.body.email, 'role' : 'admin'}, function(err, user) {
    if(!err){
      if(user != null){
        if (user.validPassword(req.body.password)) {
          const token = jwt.sign({username: user.email, id: user._id, role: user.role}, 'future@123');
          return res.json({status: true, token: 'JWT ' + token, username: user.email});
        } else {
          res.json({ status: false, message: 'Email and password not matched'})
        }
      }else{
        res.json({ status: false, message: 'Email and password not matched'})
      }
    }
  });

}

exports.updateOpentokSession = function(req, res){

  User.findOne({'_id': req.body.id}, function(err, user) {
    if(!err){
      if(user != null){
        user.opentok_session = req.body.session_id;

        user.save(function(err){
          if(err){
              res.json({status: false, message: "Error in updating blog", error: err});
          }else{
              res.json({ status: true, message: 'Session updated!', data: user });
          }
        });
      }else{
        res.json({ status: false, message: 'No user found'})
      }
    }else{
      res.json({ status: false, message: err});
    }
  });

}

exports.goOnline = function(req, res){

  User.findOne({'_id': req.body.id}, function(err, user) {
    if(!err){
      if(user != null){
        user.online = req.body.online;

        user.save(function(err){
          if(err){
              res.json({status: false, message: "Error in updating user", error: err});
          }else{
              res.json({ status: true, message: 'User updated!', data: user });
          }
        });
      }else{
        res.json({ status: false, message: 'No user found'})
      }
    }else{
      res.json({ status: false, message: err});
    }
  });

}

exports.get = function(req, res){
  User.findOne({'_id': req.params.id}, function(err, user) {
    if(!err){
      if(user != null){
        res.json({ status: true, message: 'User found', data: user})
      }else{
        res.json({ status: false, message: 'No user found'})
      }
    }else{
      res.json({ status: false, message: err});
    }
  });
}

exports.getOnlineUsers = function(req, res){
  User.find({'online': 'yes', 'role': 'channel'}, function(err, users){
    if(!err){
      if(users != null){
        res.json({ status: true, message: 'Users found', data: users})
      }else{
        res.json({ status: false, message: 'No users found'})
      }
    }else{
      res.json({ status: false, message: err});
    }
  });
}

exports.changepassword = function(req, res){ 

  User.findById({'_id': req.body.user_id}, function(err, user) { 
    if(!err){
      if(user != null){
        
        if(req.body.opass){
          if (user.validPassword(req.body.opass)) {   
                user.password = new User().generateHash(req.body.cpass);    
                user.save(function(err){ 
                  if(err){
                    res.json({ status:false, message: err }); 
                  }else{
                    res.json({ status:true, message: 'Password has been changed successfully!'}); 
                  }
                });
        
          } else {   
            res.json({ status: false, message: 'Old password is not matching!'})
          }
        }else{
          user.password = new User().generateHash(req.body.cpass);    
          user.save(function(err){ 
            if(err){
              res.json({ status:false, message: err }); 
            }else{
              res.json({ status:true, message: 'Password has been changed successfully!'}); 
            }
          });
        }

      }else{
        res.json({ status: false, message: 'User doesn\'t exists!' })
      } 
    }
  });

}

exports.forgotpassword = function(req, res){ 
  console.log(req.body);

  User.findOne({'email': req.body.email}, function(err, user) {  
    if(!err){
      if(user != null){ 
       var code = req.body.site_url+'/'+jwt.sign({username: user.email, id: user._id, role: user.role}, 'future@123');  
       var mailOptions = {  
        from: 'gurpreet@avainfotech.com',
        to: user.email,
        subject: 'Forgot Password', 
        html: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Forgot Password</title><link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500" rel="stylesheet"></head><body style="padding:15px 0; background: url(img/bgplait.png) repeat #dddddd; margin:0px auto; font-family: "Roboto", sans-serif; font-weight:400; background-size: 160px;"><table width="600" border="0" cellpadding="10" cellspacing="0" style="margin:0px auto; background:#fffefb; text-align:center;"><tr style="background:#fff;" ><td style="text-align:center; padding-top:10px; padding-bottom:10px; border-bottom:2px solid #00306b;">Salon Home</td></tr><tr><td align="center"><h2 style="text-align:center;">Hi, '+user.firstname+'</h2><h3 style="margin-top:0 ;font-weight: 600; font-size: 18px;">We received a forgot password request for your account.</h3><p>To reset your password, put this code: </p></td></tr><tr><td align="center"><p style="color:#000; font-weight:500;">'+code+'</p></td></tr><tr><td align="center"><p style="color:#000; font-weight:500;">Thank You,<br> Salon Home</p></td></tr></table></body></html>'
      };
      
      user.save(function(err){ 
        if(err){
          res.json({ status:false, message: err }); 
        }else{ 

         Mailclient.sendMail(mailOptions, function(error, info) { 
          if (error) {  
            res.json({ status: false, message: 'Email has been not sent!' });
          } else {
            console.log('else');
            res.json({ status: true, message: 'Password reset email has been sent to your registered email address.' });

          }
        });  


       }
     });
      
    }else{
      console.log('last else');
      res.json({ status: false, message: 'User doesn\'t exists with email address' });
    } 
  }else{
    console.log('last1 else');
    res.json({ status: false, message: 'Try again later!' });
  } 
});

}


exports.resetpassword = function(req, res){
  User.findOne({'_id': req.body.user_id}, function(err, user) {
    if(!err){
      if(user != null){
        user.password = user.generateHash(req.body.cpass);
        
        user.save(function(err){
          if(err){
              res.json({ status:false, message: err });
          }else{
              res.json({ status:true, message: 'Password has been reset successfully!' });
          }
        });
      }else{
        res.json({ status: false, message: 'User not found!'})
      }
    }
  });
}

exports.edit = function(req, res){
  
  User.findOne({'_id': req.body.user_id}, function(err, user) {
    if(!err){
      if(user != null){

        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.phone = req.body.phone;
        user.dob = req.body.dob;
        user.gender = req.body.gender;
        
        if(req.body.description){
          user.description = req.body.description;
        }
        if(req.body.country){
          user.country = req.body.country;
        }
        
        user.save(function(err){
          if(err){
              res.json({ status:false, message: 'Error in updating data. Ty again later!' });
          }else{
              res.json({ status:true, message: 'Profile has been updated successfully!' });
          }
        });
      }else{
        res.json({ status: false, message: 'You are not a valid user!'})
      }
    }
  });
  
}  

exports.updateProfileImage = function(req, res){
  User.findById(req.body.user_id, function(err, user) {
    if(!err){
      if(user != null){

        user.profilepic = req.body.profileurl
        
        user.save(function(err){
          if(err){
              res.json({ status:false, message: 'Error in updating data. Ty again later!' });
          }else{
              res.json({ status:true, message: 'Profile pic has been updated successfully!' });
          }
        });
      }else{
        res.json({ status: false, message: 'You are not a valid user!'})
      }
    }
  });
}

exports.updateBannerImage = function(req, res){
  User.findById(req.body.user_id, function(err, user) {
    if(!err){
      if(user != null){

        user.bannerpic = req.body.bannerurl
        
        user.save(function(err){
          if(err){
              res.json({ status:false, message: 'Error in updating data. Ty again later!' });
          }else{
              res.json({ status:true, message: 'Profile pic has been updated successfully!', data: user });
          }
        });
      }else{
        res.json({ status: false, message: 'You are not a valid user!'})
      }
    }
  });
}

exports.updatePaymentInfo = function(req, res){
  User.findById(req.body.user_id, function(err, user) {
    if(!err){
      if(user != null){

        user.payment_info = req.body
        
        user.save(function(err){
          if(err){
              res.json({ status:false, message: 'Error in updating data. Ty again later!' });
          }else{
              res.json({ status:true, message: 'Payment info has been updated successfully!', data: user });
          }
        });
      }else{
        res.json({ status: false, message: 'You are not a valid user!'})
      }
    }
  });
}

exports.getOnlineUsers = function(req, res){
  User.find({ online: 'yes' }, function(err, users) {
    if(err){
      res.json({ status: false, message: 'Server error occurred!'})
    }else{
      if(users.length > 0){
        res.json({ status:true, message: 'Channel fetched successfully!', data: users });
      }else{
        res.json({ status: false, message: 'No channel is online'})
      }
    }
  });
}

/************  Album ************/

exports.createAlbum = function(req, res){
  User.findById(req.body.user_id, function(err, user) {
    if(!err){
      if(user != null){

        var data = {
            title: req.body.title,
            thumbnail: req.body.thumbnail
        };
        
        user.albums.push(data);
        
        user.save(function(err){
          if(err){
              res.json({ status:false, message: 'Error in creating album. Ty again later!' });
          }else{
              res.json({ status:true, message: 'Album has been created successfully!', data: user });
          }
        });
      }else{
        res.json({ status: false, message: 'You are not a valid user!'})
      }
    }
  });
}

exports.getAlbums = function(req, res){
  User.findOne({'_id': req.body.user_id}, function(err, user) {
    if(!err){
      if(user != null){
        res.json({ status: true, message: 'Albums found', data: user})
      }else{
        res.json({ status: false, message: 'No album found'})
      }
    }else{
      res.json({ status: false, message: err});
    }
  });
}

exports.deleteAlbum = function(req, res){
  User.update({'albums._id' : req.body.id}, {$pull : { albums: {_id: req.body.id} } }, function(err, user){
    if (err) 
      return res.send({ status: false, message: err });
    else
      return res.json({ status: true, message: 'Album deleted successfully', data: user });
  });
}

/************  Album (End) ************/


/************  Album Images ************/

exports.uploadPhotos = function(req, res){

    User.update(
      {
        "albums._id" : mongoose.Types.ObjectId(req.body.album_id)
      },
      {
        $push:
        {"albums.$.images":
          {
          "url" : req.body.image
          }
        }
      }
   , function(err, user) {
    if(!err){
      if(user != null){
        return res.json({ status: true, message: 'Inserted!', data: user });
      }else{
        res.json({ status: false, message: 'Server error occured. Try again later!'})
      }
    }else{
      res.json({ status: false, message: 'Server error occured. Try again later!'});
    }
  });

}

exports.albumPhotos = function(req, res){
    
  var condition = {
    "$match": {
        "albums._id": mongoose.Types.ObjectId(req.body.id)
    }
  };

  var unwind = {
      "$unwind": "$albums"
  };

  var project = {
      '$project':{
          'albums':1
      }
  };
  
  
  User.aggregate([condition,unwind,condition, project], function(err, user){
      if (err){
        return res.send({ status: false, message: 'No photos found!' });
      }else{
        if(user.length > 0){
          return res.json({ status: true, message: 'Photos found!', data: user[0].albums });
        }else{
          return res.send({ status: false, message: 'No photos found!' });
        }
      }
  });


}

exports.deleteImage = function(req, res){
  User.update({'albums.images._id' : req.body.id}, {$pull : { 'albums.$.images' : { '_id': req.body.id} } }, function(err, user){
    if (err) 
      return res.send({ status: false, message: err });
    else
      return res.json({ status: true, message: 'Image deleted successfully', data: user });
  });
}

/************  Album Images (End) ************/

exports.getChannels = function(req, res){
  //Video.aggregate([

  //   {$unwind:"$subcategories"},
  //   {$unwind:"$subcategories.videos"},
  //   {$lookup: {
  //       from: 'users', 
  //       localField: 'subcategories.videos.user_id', 
  //       foreignField: '_id', 
  //       as: 'uservideos'}},
  //   {$unwind:"$uservideos"},
  //   {
  //     '$project':{

  //         'uservideos.albums': 0
  //     }
  // }

  Video.aggregate([
    {$unwind:"$subcategories"},
    {$unwind:"$subcategories.videos"},  
    {
      $lookup: {
        "from": "users",
        "localField": "subcategories.videos.user_id",
        "foreignField": "_id",
        "as": "user"
      }
    },
    {
      $lookup: {
        "from": "videoviews",
        "localField": "subcategories.videos._id",
        "foreignField": "video_id",
        "as": "views"
      }
    },
    {
      $group: {
        _id: "$subcategories.videos.user_id",
        userdata: { 
          $first: {
            _id: '$user._id',
            firstname: '$user.firstname',
            lastname: '$user.lastname'
          }
        },
        data: {
          $push: {
            "video": "$subcategories.videos",
            "views": "$views"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        userdata: 1,
        user: {
          $arrayElemAt: ["$user", 0]
        },
        data: 1
      }
    }

  ], 
  function(err, user){
    if (err) 
      return res.send({ status: false, message: err });
    else
      return res.json({ status: true,  data: user });
  });
  
}

exports.latestVideo = function(req, res){


  var condition = {
    "$match": {
      "subcategories.videos.user_id": mongoose.Types.ObjectId(req.body.id)
    }
  };

  var unwind = {
    "$unwind": "$subcategories"
  };

  var unwind2 = {
    "$unwind": "$subcategories.videos"
  };

  var sort = {
    $sort: { 'subcategories.videos.createdAt': -1 }
  }


  Video.aggregate([ condition, unwind, unwind2, condition, sort, { $limit: 1 } ], function(err, video){
    if(err){
      res.json({ status: false, message: 'Server error occured!' });
    }else{
      if(video.length > 0){
        res.json({ status: true, message: 'Video found!', data: video })
      }else{
        res.json({ status: false, message: 'No Video found!'})
      }
    }
  });
}

exports.latest5Videos = function(req, res){


  var condition = {
    "$match": {
      "subcategories.videos.user_id": mongoose.Types.ObjectId(req.body.id)
    }
  };

  var unwind = {
    "$unwind": "$subcategories"
  };

  var unwind2 = {
    "$unwind": "$subcategories.videos"
  };

  var sort = {
    $sort: { 'subcategories.videos.createdAt': -1 }
  }


  Video.aggregate([ condition, unwind, unwind2, condition, sort, { $limit: 5 } ], function(err, video){
    if(err){
      res.json({ status: false, message: 'Server error occured!' });
    }else{
      if(video.length > 0){
        res.json({ status: true, message: 'Video found!', data: video })
      }else{
        res.json({ status: false, message: 'No Video found!'})
      }
    }
  });
}

exports.likePhoto = function(req, res){
  
  User.findById(req.body.user_id, function(err, user) {
    if(!err){
      if(user != null){

        var data = {
            image_id: req.body.image_id
        };
        
        user.favorite_images.push(data);
        
        user.save(function(err){
          if(err){
              res.json({ status:false, message: 'Server error. Ty again later!', err: err });
          }else{
              res.json({ status:true, message: 'Image added to favorires successfully!', data: user });
          }
        });
      }else{
        res.json({ status: false, message: 'You are not a valid user!'})
      }
    }
  });
}

exports.likeVideo = function(req, res){

  User.findById(req.body.user_id, function(err, user) {
    if(!err){
      if(user != null){

        var data = {
            video_id: req.body.video_id
        };
        
        user.favorite_videos.push(data);
        
        user.save(function(err){
          if(err){
              res.json({ status:false, message: 'Server error. Ty again later!', err: err });
          }else{
              res.json({ status:true, message: 'Video added to favorires successfully!', data: user });
          }
        });
      }else{
        res.json({ status: false, message: 'You are not a valid user!'})
      }
    }
  });
}

exports.getFavoritePhotos = function(req, res){
  
  User.findById(req.body.user_id, { _id: 1, favorite_images: 1 },  function(err, user){
    if (err) 
      return res.send({ status: false, message: err });
    else

      if( user.favorite_images.length > 0){

        image_ids = [];

        for(var i = 0; i < user.favorite_images.length; i++ ){
          image_ids.push(user.favorite_images[i].image_id);
        }

        var condition = {
          "$match": {
            "albums.images._id": { $in: image_ids }
          }
        };
      
        var unwind = {
          "$unwind": "$albums"
        };
      
        var unwind2 = {
          "$unwind": "$albums.images"
        };

        var project = { 
          $project: {
            _id: 1,
            albums: 1
        }};
      

        User.aggregate([ condition, unwind, unwind2, condition, project ], function(err, images){
          if (err) 
            return res.send({ status: false, message: err });
          else
            return res.json({ status: true,  data: images });
        });

      }else{
        return res.send({ status: false, message: "No favorite images found!" });
      }
  });

}

exports.getFavoriteVideos = function(req, res){
  
  User.findById(req.body.user_id, { _id: 1, favorite_videos: 1 },  function(err, user){
    if (err) 
      return res.send({ status: false, message: err });
    else

      if(user.favorite_videos.length > 0){

        video_ids = [];

        for(var i = 0; i < user.favorite_videos.length; i++ ){
          video_ids.push(user.favorite_videos[i].video_id);
        }

        var condition = {
          "$match": {
            "subcategories.videos._id": { $in: video_ids }
          }
        };
      
        var unwind = {
          "$unwind": "$subcategories"
        };
      
        var unwind2 = {
          "$unwind": "$subcategories.videos"
        };

        var project = { 
          $project: {
            _id: 1,
            subcategories: 1
        }};
      

        Video.aggregate([ condition, unwind, unwind2, condition, project ], function(err, videos){
          if (err) 
            return res.send({ status: false, message: err });
          else
            return res.json({ status: true,  data: videos });
        });

      }else{
        return res.send({ status: false, message: "No favorite videos found!" });
      }
  });
  

}

exports.unlikePhoto = function(req, res){
  User.update({'_id' : req.body.user_id}, {$pull : { 'favorite_images' : { 'image_id': req.body.image_id} } }, function(err, user){
    if (err) 
      return res.send({ status: false, message: err });
    else
      return res.json({ status: true, message: 'Image removed from favorites successfully', data: user });
  });
}

exports.unlikeVideo = function(req, res){
  User.update({'_id' : req.body.user_id}, {$pull : { 'favorite_videos' : { 'video_id': req.body.video_id} } }, function(err, user){
    if (err) 
      return res.send({ status: false, message: err });
    else
      return res.json({ status: true, message: 'Video removed from favorites successfully', data: user });
  });
}

exports.updatePlans = function(req, res){

    User.findOne({ _id: req.body.user_id }, function(err, user){
      if(err){
          res.json({status: false, message: 'An Unexpected error occurs. Please try again later!'});
      }else{
          if(user != null){

              if(req.body.plans.length > 0){

                user.plans = [];

                  req.body.plans.forEach(function(element) {
                    
                    var duration = element.title.split('ly');

                      var data = {
                        title: element.title,
                        cost: element.cost,
                        duration: duration[0]
                      };
                      
                      user.plans.push(data);
                  });  
              }
              
              user.save(function(err){
                  if(err){
                      res.json({status: false, message: "Error in updating plans", error: err});
                  }else{
                      res.json({ status: true, message: 'Subscription plan has been added!' });
                  }
              });

          }else{
              res.json({status: false, message: "An Unexpected error occurs. Please try again later!"});
          }
      }
  });

}

exports.checkSubscribed = function(req, res){
  Subscriber.findOne(
    {
      user_id: mongoose.Types.ObjectId(req.body.user_id),
      channel_id: mongoose.Types.ObjectId(req.body.channel_id)
    },
    function(err, data){
      if(err){
          res.json({status: false});
      }else{
        if(data != null){
          res.json({ status: true, data: data });
        }else{
          res.json({ status: false});
        }
      }
    }
  )
}

exports.getSubscriptions = function(req, res){
  Subscriber.find(
    {
      user_id: mongoose.Types.ObjectId(req.body.user_id)
    },
    function(err, data){
      if(err){
          res.json({status: false});
      }else{
        if(data != null){
          res.json({ status: true, data: data });
        }else{
          res.json({ status: false});
        }
      }
    }
  )
}

schedule.scheduleJob('0	0,12 * * *', function(){
//exports.checkSubscriptions = function(req, res){
  Subscriber.find(
    {
      enddate: {
        $lte: new Date()
      }
    },
    function(err, data){
      if(err){
          res.json({status: false});
      }else{
        if(data.length > 0){

          var ids = [];

          for(var i = 0; i < data.length; i++){
            ids.push(mongoose.Types.ObjectId(data[i]._id));
          }

          Subscriber.remove({_id:{$in:ids}}, function(err, data){
            if(err){
              res.json({ status: false});
            }else{
              res.json({ status: true, message: 'Deleted successfully', data: data });
            }
          });

          Subscriptions.find(
            {
              enddate: {
                $lte: new Date()
              },
              status: 'active'
            },
            function(err, data){
              if(err){
                  res.json({status: false});
              }else{
                if(data.length > 0){
                  var ids = [];

                  for(var i = 0; i < data.length; i++){
                    ids.push(mongoose.Types.ObjectId(data[i]._id));

                    User.findById(data[i]._id, function(err, user1){
                      if(!err){
                        if(user1 != null){
                          var mailOptions = {  
                              from: 'gurpreet@avainfotech.com',
                              to: user1.email,
                              subject: 'Subscription Expired', 
                              html: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Subscription Expired</title><link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500" rel="stylesheet"></head><body style="padding:15px 0; background: url(img/bgplait.png) repeat #dddddd; margin:0px auto; font-family: "Roboto", sans-serif; font-weight:400; background-size: 160px;"><table width="600" border="0" cellpadding="10" cellspacing="0" style="margin:0px auto; background:#fffefb; text-align:center;"><tr style="background:#fff;" ><td style="text-align:center; padding-top:10px; padding-bottom:10px; border-bottom:2px solid #00306b;">My Model Connection</td></tr><tr><td align="center"><h2 style="text-align:center;">Hi, '+user1.firstname+'</h2><h3 style="margin-top:0 ;font-weight: 600; font-size: 18px;">Subscription Expired</h3><p>Your one of the subscription has been expired. To check, see your subscribed channel list.</p></td></tr></table></body></html>'
                          };
        
                          Mailclient.sendMail(mailOptions, function(error, info) { 
                              if (error) {  
                                  res.json({ status: false, message: 'Server error occurred! Try again 6!' });
                              } else {
                                  res.json({ status: true, message: 'Email sent' });
                              }
                          }); 
                        }
                      }
                    });

                    

                  }

                  Subscriptions.update(
                    { _id : { $in: ids }}, 
                    { $set : {status : 'expired'} },
                    { multi : true },
                    function(err, data) {
                      if (err) 
                        res.json({ status: false, err: err});
                      else
                        res.json({ status: true, message: 'updated successfully', data: data });
                  }); 

                }
              }
            }
          );  

        }else{
          res.json({ status: false});
        }
      }
    }
  )
});
//}

exports.listUserSubscriptions = function(req, res){
  
  Subscriptions.aggregate([
    {
      "$match": {
        "user_id": mongoose.Types.ObjectId(req.body.user_id)
      }
    },
    {
      $lookup: {
        "from": "users",
        "localField": "channel_id",
        "foreignField": "_id",
        "as": "channel"
      }
    },
    {
      $project: {
        _id: 0,
        'channel.albums': 0,
        'channel.plans': 0,
        'channel.payment_info': 0,
        'channel.favorite_images': 0,
        'channel.favorite_videos': 0
      }
    }

  ], 
  function(err, channels){
    if (err) 
      return res.send({ status: false, message: err });
    else
      return res.json({ status: true,  data: channels });
  });

}

exports.allSubscriptions = function(req, res){
  Subscriptions.aggregate([
    {
      $lookup: {
        "from": "users",
        "localField": "channel_id",
        "foreignField": "_id",
        "as": "channel"
      }
    },
    {
      $lookup: {
        "from": "users",
        "localField": "user_id",
        "foreignField": "_id",
        "as": "user"
      }
    },
    {
      $sort: { 'startdate': -1 }
    },
    {
      $project: {
        'channel.albums': 0,
        'channel.plans': 0,
        'channel.payment_info': 0,
        'channel.favorite_images': 0,
        'channel.favorite_videos': 0,
        'user.albums': 0,
        'user.plans': 0,
        'user.payment_info': 0,
        'user.favorite_images': 0,
        'user.favorite_videos': 0
      }
    }

  ], 
  function(err, data){
    if (err) 
      return res.send({ status: false, message: err });
    else
      return res.json({ status: true,  data: data });
  });
}

exports.getSubscription = function(req, res){
  Subscriptions.aggregate([
    {
      "$match": {
        "_id": mongoose.Types.ObjectId(req.body.id)
      }
    },
    {
      $lookup: {
        "from": "users",
        "localField": "channel_id",
        "foreignField": "_id",
        "as": "channel"
      }
    },
    {
      $lookup: {
        "from": "users",
        "localField": "user_id",
        "foreignField": "_id",
        "as": "user"
      }
    },
    {
      $sort: { 'startdate': -1 }
    },
    {
      $project: {
        'channel.albums': 0,
        'channel.plans': 0,
        'channel.payment_info': 0,
        'channel.favorite_images': 0,
        'channel.favorite_videos': 0,
        'user.albums': 0,
        'user.plans': 0,
        'user.payment_info': 0,
        'user.favorite_images': 0,
        'user.favorite_videos': 0
      }
    }

  ], 
  function(err, data){
    if (err) 
      return res.send({ status: false, message: err });
    else
      if(data.length > 0){
        return res.json({ status: true,  data: data });
      }else{
        return res.json({ status: false, message: 'no data found' });
      }
  });
}
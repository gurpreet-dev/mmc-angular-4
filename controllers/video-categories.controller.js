const VideoCategory = require('../models/video-categories.model');
const Views = require('../models/video-views.model');
var mongoose = require('mongoose');

exports.allCategory = function(req, res){
    VideoCategory.find({}, function(err, category) {
        if(err){
            res.json({ status:false, message: err });
        }else{
          //if(typeof category !== 'undefined' && category.length > 0){
        if(category.length > 0){
            res.json({ status:true, message: 'Categories found!', data: category });
          }else{
            res.json({ status:false, message: 'No categories found' });
          }
        }
      });    
}

exports.allCategory2 = function(req, res){
    VideoCategory.find({ "status" : "1" }, function(err, category) {
        if(err){
            res.json({ status:false, message: err });
        }else{
          //if(typeof category !== 'undefined' && category.length > 0){
        //if(category.length > 0){
            res.json({ status:true, message: 'Categories found!', data: category });
        //   }else{
        //     res.json({ status:false, message: 'No categories found' });
        //   }
        }
      });    
}

exports.addCategory = function(req, res){

    VideoCategory.findOne({'title': req.body.title.trim()}, function(err, category) {
        if(!err){
          if(!category){
    
            var new_category = new VideoCategory({
              title: req.body.title
            });

            new_category.save(function(err){
              if(err){
                  res.json({ status:false, message: err });
              }else{
                  res.json({ status:true, message: 'Category created!' });
              }
            });
    
          }else{
            res.json({ status:false, message: 'Category already exists!' });
          }
        }else{
          res.json({ status:false, message: 'Please try again' });
        }
      });    

}

exports.getCategory = function(req, res){
    console.log(req.params.id);

    VideoCategory.findById( req.params.id , function(err, category) {
        if(err){
            res.json({ status:false, message: 'No Category found' });
        }else{
            if(!category){
                res.json({ status:false, message: 'No Category found' });
            }else{
                res.json({ status:true, message: 'Category found', data: category });
            }
        }
    });
}

exports.editCategory = function(req, res){

    VideoCategory.findById(req.params.id, function(err, category){
        if(err){
            res.json({status: false, message: "Category not found with this ID", error: err});
        }else{
            category.title = req.body.title;
            category.status = req.body.status;

            category.save(function(err){
                if(err){
                    res.json({status: false, message: "Error in updating category", error: err});
                }else{
                    res.json({status: true,  message: 'Category updated!' });
                }
            });

        }
    });

}

exports.deleteCategory = function(req, res){
    VideoCategory.findById(req.params.id, function(err, category){
        if(err){
            res.json({status: false, message: err, error: err});
        }else{
            if(category){
                VideoCategory.remove({'_id':req.params.id}, function(err){
                    if(err){
                        res.json({status: false, message: "Error in deleting category", error: err});
                    }else{
                        res.json({status: true, message: "Category Deleted" });
                    }
                })
            }else{
                res.json({status: false, message: "No category found with this ID"});
            }
        }
    })
}

///////   Sub categories   ///////



exports.allSubcategory = function(req, res){
    VideoCategory.aggregate([{ $unwind :'$subcategories'}], function(err, subcategories){
        if (err) {
            return res.json({ status: false, message: 'No subcategories found!'});
        }else{
            if(subcategories.length > 0){
                return res.json({ status: true, message: 'Subcategories found!', data: subcategories});
            }else{
                return res.json({ status: false, message: 'No subcategories found!'});
            }
        }
      });    
}

exports.addSubcategory = function(req, res){
    // VideoCategory.findById(req.body.category, function(err, category){
    //     if(err){
    //       res.send(err);
    //     }
    
    //     category.subcategories.push({
    //         title: req.body.title,
    //         slug: req.body.slug,
    //         meta_keywords: req.body.meta_keywords,
    //         meta_description: req.body.meta_description
    //     });
    
    //     category.save(function(err){
    //         if(err){
    //             res.json({status: false, message: err});
    //         }else{
    //             res.json({status: true, message: 'Subcategory saved successfully', data: category});
    //         }
    //     })
        
    //   }); 

    VideoCategory.update(
        { _id: req.body.category, 
            'subcategories.title': {
                $ne: req.body.title
            }
        }, 
        { $push: 
            { subcategories: 
                { title: req.body.title.trim(), slug: req.body.slug, meta_keywords: req.body.meta_keywords,meta_description: req.body.meta_description} 
            } 
        }, 
        function(err, data){
            if(err){
                res.json({status: false, message: err});
            }else{
                if(data.nModified == 1){
                    res.json({status: true, message: 'Subcategory saved successfully', data: data});
                }else{
                    res.json({status: false, message: 'Subcategory already exists!', data: data});
                }
            }
        }
    );
}

exports.getSubcategory = function(req, res){

    var condition = {
        "$match": {
            "subcategories._id": mongoose.Types.ObjectId(req.params.id)
        }
    };

    var unwind = {
        "$unwind": "$subcategories"
    };
    
    
    VideoCategory.aggregate([condition,unwind,condition], function(err, category){
        if (err) 
            return res.send({ status: false, message: 'No subcategory found!' });
        else
            return res.json({ status: true, message: 'Subcategory found!', data: category });
    });
}

exports.updateSubcategory = function(req, res){

    VideoCategory.findOneAndUpdate(
        {
            'subcategories._id' : req.params.id
        }, 
        {
            $set : { 
                'subcategories.$.title': req.body.title, 
                'subcategories.$.slug': req.body.slug, 
                'subcategories.$.meta_keywords' : req.body.meta_keywords, 'subcategories.$.meta_description' : req.body.meta_description,
                'subcategories.$.status': req.body.status, 
            } 
        },
        { 
            runValidators: true
        }, 
        function(err, category){
        if (err) 
          return res.send({ status: false, message: 'Subcategory title already exists!' });
        else
          return res.json({ status: true, message: 'Subcategory updated successfully', data: category });
    });
    
}

exports.addVideo = function(req, res){
    
    var categories = req.body.categories;

    var i = 1;

    categories.forEach(function(category){
        
        VideoCategory.update(
            {
                'subcategories._id' : category
            }, 
            { $push: 
                { "subcategories.$.videos" : 
                    { 
                        title: req.body.title.trim(), 
                        thumbnail: req.body.thumbnail, 
                        video: req.body.video, 
                        duration: req.body.duration, 
                        size: req.body.size,
                        description: req.body.description,
                        user_id: req.body.user_id,
                        views: 0
                    } 
                } 
            },
            {
                new:true
            }, 
            function(err, data){
                if(err){
                    res.json({status: false, message: err});
                }else{
                    console.log(data);
                }
            }
        );

        if(i == categories.length){
            return res.json({ status: true, message: 'Video added successfully' });
        }

        i++;

    });

}

exports.getUserVideos = function(req, res){
    
    var condition = {
        "$match": {
            "subcategories.videos.user_id": mongoose.Types.ObjectId(req.body.user_id)
        }
    };

    var unwind = {
        "$unwind": "$subcategories"
    };

    var unwind2 = {
        "$unwind": "$subcategories.videos"
    };

    var project = {
        '$project':{
            'subcategories.videos':1
        }
    };
    
    
    VideoCategory.aggregate([condition, unwind, unwind2, condition, project], function(err, category){
        if (err) 
            return res.send({ status: false, message: 'No videos found!' });
        else
            return res.json({ status: true, message: 'Videos found!', data: category });
    });

}

exports.getSubcategoryVideos = function(req, res){
    var condition = {
        "$match": {
            "subcategories.slug":req.body.slug
        }
    };

    var unwind = {
        "$unwind": "$subcategories"
    };

    var sort = {
        $sort: { 'subcategories.videos.createdAt': -1 }
      }
    
    
    VideoCategory.aggregate([ condition, unwind, condition, sort ], function(err, category){
        if (err) {
            return res.send({ status: false, message: 'No subcategory found!' });
        }else{
            if(category.length > 0){
                return res.json({ status: true, message: 'Subcategory found!', data: category });
            }else{
                return res.json({ status: false, message: 'No Subcategory found!' });
            }
        }
    });
}

exports.getSubcategoryVideosById = function(req, res){

    VideoCategory.aggregate([
        {
            "$match": {
                "subcategories._id":  mongoose.Types.ObjectId(req.body.id)
            }
        },
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
                "title": "$subcategories.title"
            }
            }
        }
        },
        {
        $project: {
            _id: 0,
            title: 1,
            userdata: 1,
            user: {
            $arrayElemAt: ["$user", 0]
            },
            data: 1
        }
        },
        {$unwind:"$data"},
        {
            $sort: { 'data.video.createdAt': -1 }
        }
        ], 
        function(err, user){
            if (err) 
            return res.send({ status: false, message: err });
            else
            return res.json({ status: true,  data: user });
        }
    );
}

exports.getVideo = function(req, res){
    var condition = {
        "$match": {
            "subcategories.videos._id":  mongoose.Types.ObjectId(req.body.id)
        }
    };

    var unwind = {
        "$unwind": "$subcategories"
    };

    var unwind2 = {
        "$unwind": "$subcategories.videos"
    };
    
    
    VideoCategory.aggregate([ condition, unwind, unwind2, condition ], function(err, video){
        if (err) {
            return res.send({ status: false, message: 'No video found!' });
        }else{
            if(video.length > 0){
                return res.json({ status: true, message: 'video found!', data: video });
            }else{
                return res.json({ status: false, message: 'No video found!' });
            }
        }
    });
}

exports.getVideos = function(req, res){
    VideoCategory.aggregate([
        { $unwind :'$subcategories'}, 
        { $unwind :'$subcategories.videos'}, 
        {
            $lookup: {
              "from": "videoviews",
              "localField": "subcategories.videos._id",
              "foreignField": "video_id",
              "as": "views"
            }
        },
        { $sort: { 'subcategories.videos.views': -1 }}, 
        { $limit: 10 }], 
        function(err, videos){
        if (err) {
            return res.json({ status: false, message: 'No videos found!'});
        }else{
            if(videos.length > 0){
                return res.json({ status: true, message: 'Videos found!', data: videos});
            }else{
                return res.json({ status: false, message: 'No videos found!'});
            }
        }
      });   
}

exports.getAllVideos = function(req, res){
    VideoCategory.aggregate([{ $unwind :'$subcategories'}, { $unwind :'$subcategories.videos'}, { $sort: { 'subcategories.videos.createdAt': -1 }}, { $limit: 10 }], function(err, videos){
        if (err) {
            return res.json({ status: false, message: 'No videos found!'});
        }else{
            if(videos.length > 0){
                return res.json({ status: true, message: 'Videos found!', data: videos});
            }else{
                return res.json({ status: false, message: 'No videos found!'});
            }
        }
      });   
}

exports.searchVideos = function(req, res){

    var condition = {
        "$match": {
            "subcategories.videos.title":  { "$regex" : "(.+)*"+req.body.term+"(.+)?" , "$options" : "i"}
        }
    };

    var unwind = {
        "$unwind": "$subcategories"
    };

    var unwind2 = {
        "$unwind": "$subcategories.videos"
    };
    
    
    VideoCategory.aggregate([ condition, unwind, unwind2, condition ], function(err, video){
        if (err) {
            return res.send({ status: false, message: 'No video found!', err: err });
        }else{
            if(video.length > 0){
                return res.json({ status: true, message: 'video found!', data: video });
            }else{
                return res.json({ status: false, message: 'No video found!' });
            }
        }
    });

}


exports.incrementView = function(req, res){

    Views.findOne({ video_id: mongoose.Types.ObjectId(req.body.video_id) }, function(err, view){
        if(!err){
            if(view != null){
                var views = view.views + 1;
                view.views = views;

                view.save(function(err){
                    if(err){
                        return res.json({ status: false });
                    }else{
                        return res.json({ status: true, message: 'Incremented!', data: view });
                    }
                });

            }else{
                var views = new Views({
                    video_id: req.body.video_id,
                    views: 1
                });

                views.save(function(err){
                    if(err){
                        return res.json({ status: false });
                    }else{
                        return res.json({ status: true, message: 'Saved and Incremented!', data: view });
                    }
                });
            }
        }
    })

    
}

exports.getViews = function(req, res){

    console.log(req.body)

    Views.findOne({ video_id: mongoose.Types.ObjectId(req.body.video_id) }, function(err, views){
        if(err){
            return res.json({ status: false });
        }else{
            if(views != null){
                return res.json({ status: true, message: 'Found!', data: views });
            }else{
                return res.json({ status: false });
            }
        }
    }); 
    
}
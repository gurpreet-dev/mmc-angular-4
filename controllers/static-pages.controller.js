const Pages = require('../models/static-pages.model');
var mongoose = require('mongoose');

exports.add = function(req, res){

    Pages.findOne({'title': req.body.title.trim()}, function(err, page) {
        if(!err){
          if(!page){
    
            var new_page = new Pages({
                title: req.body.title,
                content: req.body.content,
                slug: req.body.slug
            });

            new_page.save(function(err){
              if(err){
                  res.json({ status:false, message: err });
              }else{
                  res.json({ status:true, message: 'Page created!' });
              }
            });
    
          }else{
            res.json({ status:false, message: 'Page title already exists!' });
          }
        }else{
          res.json({ status:false, message: 'Please try again' });
        }
      });  
}

exports.list = function(req, res){

    Pages.find({}, function(err, faq){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            res.json({ status: true, message: 'Pages Found!', data: faq})
        }
    }).sort( { createdAt: -1 } );

}

exports.get = function(req, res){

    Pages.findById(req.params.id, function(err, page){
         if(err){
             res.json({ status: false, message: 'Server error occurred! Try again', error: err })
         }else{
             if(page != null){
                res.json({ status: true, message: 'Page Found!', data: page})
             }else{
                res.json({ status: false, message: 'No Page found' })
             }
         }
     });

}

exports.getBySlug = function(req, res){

    Pages.findOne({"slug": req.params.slug}, function(err, page){
         if(err){
             res.json({ status: false, message: 'Server error occurred! Try again', error: err })
         }else{
             if(page != null){
                res.json({ status: true, message: 'Page Found!', data: page})
             }else{
                res.json({ status: false, message: 'No Page found' })
             }
         }
     });

}


exports.edit = function(req, res){

    Pages.find({ title: req.body.title.trim(), _id: {$ne: req.body.id} }, function(err, pages){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            if(pages.length == 0){

                Pages.findById(req.body.id, function(err, page){
                    if(page != null){

                        page.title = req.body.title;
                        page.content = req.body.content;
                        page.status = req.body.status;
                        page.slug = req.body.slug;
        
                        page.save(function(err){
                            if(err){
                                res.json({ status: false, message: 'Server error occurred! Try again', error: err })
                            }else{
                                res.json({ status: true, message: 'Page updated successfully!', data: page})
                            }
                        });
        
        
                    }else{
                        res.json({ status: false, message: 'Server error occurred! Try again', error: err })
                    }
                });

            }else{
                res.json({ status:false, message: 'Page title already exists!' });
            }


           
        }
    });

}

// exports.delete = function(req, res){

//     Faq.findByIdAndRemove(req.body.id, function (err, faq) {
//         if(err){
//             res.json({status: false, message: 'Error in deleting faq. Try again later!'});
//         }else{
//             if(faq != null){
//                 res.json({status: true, message: 'Faq deleted successfully!', data: faq});
//             }else{
//                 res.json({status: false, message: 'Error in deleting faq. Try again later!'});
//             }
//         }
//     });

// }
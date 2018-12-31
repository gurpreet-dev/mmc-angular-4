const Faq = require('../models/faq.model');
var mongoose = require('mongoose');

exports.add = function(req, res){

    var faq = new Faq({
        question: req.body.question,
        answer: req.body.answer
    });

    faq.save(function(err){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            res.json({ status: true, message: 'Faq saved successfully!'})
        }
    });

}

exports.list = function(req, res){

    Faq.find({}, function(err, faq){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            res.json({ status: true, message: 'Faq Found!', data: faq})
        }
    }).sort( { createdAt: -1 } );

}

exports.get = function(req, res){

     Faq.findById(req.params.id, function(err, faq){
         if(err){
             res.json({ status: false, message: 'Server error occurred! Try again', error: err })
         }else{
             if(faq != null){
                res.json({ status: true, message: 'Faq Found!', data: faq})
             }else{
                res.json({ status: false, message: 'No faq found' })
             }
         }
     });

}

exports.edit = function(req, res){

    Faq.findById(req.body.id, function(err, faq){
        if(err){
            res.json({ status: false, message: 'Server error occurred! Try again', error: err })
        }else{
            if(faq != null){

                faq.question = req.body.question;
                faq.answer = req.body.answer;

                faq.save(function(err){
                    if(err){
                        res.json({ status: false, message: 'Server error occurred! Try again', error: err })
                    }else{
                        res.json({ status: true, message: 'Faq updated successfully!', data: faq})
                    }
                });


            }else{
                res.json({ status: false, message: 'Server error occurred! Try again', error: err })
            }
        }
    });

}

exports.delete = function(req, res){

    Faq.findByIdAndRemove(req.body.id, function (err, faq) {
        if(err){
            res.json({status: false, message: 'Error in deleting faq. Try again later!'});
        }else{
            if(faq != null){
                res.json({status: true, message: 'Faq deleted successfully!', data: faq});
            }else{
                res.json({status: false, message: 'Error in deleting faq. Try again later!'});
            }
        }
    });

}
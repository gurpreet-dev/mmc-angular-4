const SubscriptionPlan = require('../models/subscription-plans.model');

////  ADD  ////

exports.add = function(req, res){

    SubscriptionPlan.findOne({ title: req.body.title.trim() }, function(err, plan){
        if(err){
            res.json({status: false, message: 'An Unexpected error occurs. Please try again later!'});
        }else{
            if(!plan){
                var plan = new SubscriptionPlan({
                    title: req.body.title.trim(),
                    cost: req.body.cost,
                    duration: req.body.duration
                });

                if(req.body.items.length > 0){

                    req.body.items.forEach(function(element) {
                        if(element.feature != ''){
                            var data = {
                                feature: element.feature,
                                access: element.access
                            };
                            
                            plan.features.push(data);
                        }     
                    });  
                }
                
                plan.save(function(err){
                    if(err){
                        res.json({status: false, message: "Error in adding plan", error: err});
                    }else{
                        res.json({ status: true, message: 'Subscription plan has been added!' });
                    }
                });

            }else{
                res.json({status: false, message: "Title already exists!"});
            }
        }
    });

}

exports.list = function(req, res){
    SubscriptionPlan.find({}, function(err, plans){
        if(err){
            res.json({status: false, message: 'Error in fetching Plans. Try again later!'})
        }else{
            res.json({status: true, message: 'Plans fetched successfully!', data: plans});
        }
    });
}

exports.edit = function(req, res){

    SubscriptionPlan.findById(req.body.id, function(err, plan){
        if(err){
            res.json({status: false, message: "Error in finding data!", error: err});
        }else{
            if(plan != null){
                
                title = req.body.title.trim();
                cost = req.body.cost;
                duration = req.body.duration;
                plan.features = [];

                if(req.body.items.length > 0){

                    req.body.items.forEach(function(element) {
                    var data = {
                            feature: element.feature,
                            access: element.access
                        };
                        plan.features.push(data);   
                    });  
                }
                
                plan.save(function(err){
                    if(err){
                        res.json({status: false, message: "Error in updating plan", error: err});
                    }else{
                        res.json({ status: true, message: 'Subscription plan has been updated!' });
                    }
                });

            }else{
                res.json({status: false, message: "This plan doesn't exists!"});
            }
        }
    });
    
}

exports.delete = function(req, res){

    SubscriptionPlan.findByIdAndRemove(req.params.id, function (err, plan) {
        if(err){
            res.json({status: false, message: 'Error in deleting plan. Try again later!'});
        }else{
            if(plan != null){
                res.json({status: true, message: 'Plans deleted successfully!', data: plan});
            }else{
                res.json({status: false, message: 'Error in deleting plan. Try again later!'});
            }
        }
    });

}

exports.get = function(req, res){
    SubscriptionPlan.findOne({'_id': req.params.id}, function(err, plan) {
        if(!err){
          if(plan != null){
            res.json({ status: true, message: 'Plan found', data:plan})
          }else{
            res.json({ status: false, message: 'No plan found'})
          }
        }else{
          res.json({ status: false, message: 'An error occurs. Try again later!'});
        }
    });
}
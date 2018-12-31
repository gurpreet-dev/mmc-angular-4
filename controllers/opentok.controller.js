const OpenTok = require('opentok');

var opentok_apiKey='46166842',
opentok_secretKey='2d2321a865951aa1922402ed6d5a019c3293d996',
opentok = new OpenTok(opentok_apiKey, opentok_secretKey);

exports.createSession = function(req, res){

  opentok.createSession({mediaMode:"routed"}, function(err, session) {
      if(err){
        res.json({ status:false, message: err });
      }else{
        res.json({ status:true, message: 'Session created!', session_id:session.sessionId });
      }
  });

}

exports.generateToken = function(req, res){
  try{
    const token = opentok.generateToken(req.body.sessionId, {
      role: req.body.role,
      data: JSON.stringify({ userName: req.body.userName, userType: req.body.userType }),
      expireTime: Math.round((Date.now() / 1000) + (2 * 60)) // 6 hour from now()
    })
    res.json({ status:true, message: 'Token created!', token: token });
  } catch (e) {
    res.json({ status:false, message: e });
  }

}
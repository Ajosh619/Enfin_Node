var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');//require db statements
var validateSchema = require('../jsonvalidator/valid');//require json validation

var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');
var saltrounds = 10;
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('login',{ title: 'login'});
  //res.render('send to login Page');
});
router.post('/', async function (req, res, next) {
  try {
    var email = req.body.email;
    var PlaintextPassword = req.body.password;
    var user = await userService.getUser({ email: email });
    if(user){
      var dbpswd = user.password;     
      var rs = await bcrypt.compare(PlaintextPassword, dbpswd);      
      if(rs){
        var token = jwt.sign({ name: user.name,id: user._id,role: user.role }, config.secret);// secret : "hgh"
        res.cookie('token', token, { signed: true });
        res.redirect('/users');
      }
      else{
        //res.send('Your Email and Password is incorrect' );
        res.render('login',{ title: 'login',error: 'Your email and password is not correct'});
      }
    }
    else{
      res.render('login',{ title: 'login',error: 'Your email and password is not correct'});
    }
  } catch (e) {
    //res.render('login', { success: false });//login page
    res.send('Your Email and Password is incorrect' );
  }

});

router.get('/register', function(req, res, next) {
  res.render('register', { title: "register" })  
}); 
router.post('/register', validateSchema({ schemaName: 'new-user1', view: 'register',title: "register"  }), async function(req, res) {  
  try {
    var check = await userService.getUser({ email : req.body.email});    
    if(check){       
      res.render('register', { title: "register", condition: true, error : 'This email is already exit' });
    }else{
      pass = req.body.password.trim() ;
      conpass = req.body.confirm_password.trim() ;

      if (pass && (pass === conpass) ) {
        var hash = await bcrypt.hash(pass, saltrounds);

        let usr = {
          name  :req.body.name,
          email :req.body.email,
          password : hash
        };
        let result = await userService.createUser(usr);//createUser required from userService.....see require('')    
        res.redirect('/');
        //res.send('Succesfully Saved');
      }  
    }
 // }
  } catch(e) {
    //console.log(e);
    res.render('register', { title: "register", success: false });
  }
});

router.get('/logout', function(req,res,next){
  try{
    res.clearCookie('token');
    res.redirect('/');
  }catch(e){
    res.redirect('/');
  }
});

module.exports = router;



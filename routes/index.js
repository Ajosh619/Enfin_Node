var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');//require db statements
var validateSchema = require('../jsonvalidator/valid');//require json validation

var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');
var saltrounds = 10;
var multer = require('multer');
var fs = require('file-system');
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('login',{ title: 'login'});
  res.render('send to login Page');
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
        //res.cookie('token', token, { signed: true });
        //res.redirect('/users');
        
        res.json({status:'Success', Response: "Successfully Logined",token : token,User_Role :  user.role,User_Name: user.name,User_Photo : user.image})
      }
      else{
        res.json({status:'Error', Error: "That's not responding"})
        //res.render('login',{ title: 'login',error: 'Your email and password is not correct'});
      }
    }
    else{
      res.json({status:'Error',Error:"The Email and password doesn't match"})
      // res.render('login',{ title: 'login',error: 'Your email and password is not correct'});
    }
  } catch (e) { 
     res.json({status:'Error'})   
    //res.send('Your Email and Password is incorrect' );
  }

});

//router.get('/register', function(req, res, next) {
  //res.render('register', { title: "register" })  
//}); 
router.post('/register', validateSchema({ schemaName: 'new-user1', view: 'register',title: "register"  }), async function(req, res) {  
  try {
    var check = await userService.getUser({ email : req.body.email});    
    if(check){ 
      res.json({status:'Error',response:'This Email is already exits'});      
      //res.render('register', { title: "register", condition: true, error : 'This email is already exit' });
    }else{
      pass = req.body.password.trim();
      conpass = req.body.confirm_password.trim() ;

      if (pass && (pass === conpass) ) {
        var hash = await bcrypt.hash(pass, saltrounds);
        let usr = {
          name  :req.body.name,
          email :req.body.email,
          password : hash
        };
        let result = await userService.createUser(usr);//createUser required from userService.....see require('')    
        //delete result.password;
        res.json({status:'Success',response:'User Details Successfully Saved'});
      }  
      else{
        res.json({status:'Error',response:'Passwords are not matched'});
      }
    }
 // }
  } catch(e) {
    res.json({status:'Error',response:"It's Error"});
  }
});

router.get('/getallusers', async function (req,res){
  try{
    var userdatas = await userService.getUsers();
    //console.log(userdatas);
    res.json({status:'Success', res:userdatas});
    
  }catch(e){
    res.json({status:'err', response:'error'});
  }
})
router.post('/delete', async function(req, res, next) {
  try {
    var o_id = req.body.id;
    var result = await userService.deleteUser({_id: o_id});   
    res.json({ success: 'Successfully Deleted' });
  } catch(e) {
    res.json({ success: "Something It's Error" });
  }
});

router.post('/update', async function(req,res,next){
  try{
    var o_id = req.body.id;
    var edit = await userService.updateUser({ _id: o_id},
      {$set: {
        name : req.body.name.trim(),
        email : req.body.email,
        status : req.body.status,
        role : req.body.role
      }      
    });  

    var editres = await userService.getUser({ _id: o_id });

   res.json({response:'success',res:'Successfully Updated',datas:editres});
  }catch(e){
    res.json({response:'Error',datas:e});  
  }
})
router.get('/edit/:id', async function(req,res,next){
  try{
    var edit_id = req.params.id;
    //console.log(edit_id);
    var editres = await userService.getUser({ _id: edit_id });
    //console.log(editres);
    res.json({status: 'Success', res:editres});
  }catch(e){
    res.json({status: 'Error', res:e});
  } 
})

var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './public/uploads');  
  },  
  filename: function (req, file, callback) {  
    
    //var filename = file.originalname.split(" ").join("_");
    callback(null, Date.now() + '-' + file.originalname );  
  }  
});

 let upload = multer({storage: storage});
 
router.post('/fileupload', upload.single('photo'), function (req, res) {
    if (!req.file) {
        //console.log("No file received");
         res.json({ success: false,res: 'file not uploaded'});
    
      } else {
        //console.log('file received');
         res.json({success: true, res:'file uploaded successfully',file:req.file.filename })
      }
});

router.post('/fileupload2', async function (req, res) {
    try {     
      var image = req.body.image;
      var oldFileName = req.body.old_image;
      var user_id = req.body.user_id;       
      var re = /(?:\.([^.]+))?$/;
      var ext = re.exec(image)[1];     
      var arr = ["png", "jpg", "jpeg", "gif","PNG", "JPG", "JPEG", "GIF"];
      if (arr.includes(ext) === false) {        
        fs.unlink('./public/uploads/' + image, (err) => {         
        });
        res.json({ success: false, res: image + ' file  is not uploaded, image files only allowed',img:oldFileName });
      }
      else{      
      var edituser = await userService.updateUser( { _id: user_id },
        { $set: 
          { 
            imagefile: req.body.originalname, 	 
            image: image
          }
        });
        fs.unlink('./public/uploads/'+oldFileName, (err) => {          
        });
       res.json({ success: true,res: 'file inserted successfully',img:image });  
    } 
  }
    catch(e) {
      //console.log('file received');
       res.json({success: false, res: e })
    }
});


router.get('/search/:srch', async function(req,res,next){
  try{ 
    var srch = req.params.srch;
    console.log(srch)
    var editres = await userService.getUsers({  $or: [ { name: {$regex:srch} }, { email: {$regex:srch} } ] })
    res.json({status: 'Success', res:editres});
  }
  catch(e){
    res.json({status: 'Error', res:'Unable to find Datas'});
  }
})

router.get('/logout', function(req,res,next){
  try{
    res.clearCookie('token');
    res.redirect('/');
  }catch(e){
    res.redirect('/');
  }
});

module.exports = router;



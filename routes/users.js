var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');
var multer = require('multer');
var fs = require('file-system');
/* GET users listing. */




router.get('/',  function(req, res, next) {
  var user_role = req.user.role;
  //if(user_role === 2){
    res.render('dashboard',{ title: 'userslist', user_role : user_role });
   // res.redirect('users/userslist:query?', user_role); 
  //}else{
    //res.render('dashboard',{ title: 'dashboard' }); 
   // res.redirect('users/dashboard:query?', user_role); 
  //}
});

router.get('/userslist', function(req, res, next) {
  var user_role = req.user.role;
  res.render('userslist',{ title: "userslist", user_role : user_role  });  
})

//router.get('/dashboard', function(req, res, next) {
  //var user_role =  req.query;
  //res.render('dashboard',{ title: "dashboard" });  
//})


router.get('/ajax/get-users', function (req, res, next) {
  //console.log(req.query.search);
  //console.log(req.query);
  var options = {
    select: 'name email role status date',
    lean: true,
    offset: parseInt(req.query.offset),
    limit: parseInt(req.query.limit)
   
  };
                    //search query
  userService.paginateUser({  $or: [ { name: {$regex:req.query.search} }, { email: {$regex:req.query.search} } ] }, options)
    .then(function (result) {
      res.json({ success: 1, rows: result.docs, total: result.total });
    })
    .catch(function (e) {
      res.json({ success: 0, rows: [] });
    })
});
router.get('/edit/:id', async function(req,res,next){
  try{
    var edit_id = req.params.id;
    //console.log(edit_id);
    var editres = await userService.getUser({ _id: edit_id });
    //console.log(editres);
    res.render('edit',{title: 'edit', editres:editres});
  }catch(e){
    res.render('edit',{title: 'edit'});
  } 
})
router.post('/edit/:id', async function(req,res,next){
  try{
    var o_id = req.params.id;
    var edit = await userService.updateUser({ _id: o_id},
      {$set: {
        name : req.body.name.trim(),
        email : req.body.email,
        status : req.body.status,
        role : req.body.role
      }      
    });
    //console.log(edit);
    var editres = await userService.getUser({_id: o_id});
    //console.log(editres);
    
   res.render('userslist',{title:'userslist',success: true});
  }catch(e){
    //res.render('edit', { title:edit,success: false});
    res.send('userslist not stored' );   
  }
})
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './public/uploads');  
  },  
  filename: function (req, file, callback) {  
    
    callback(null, Date.now() + '-' + file.originalname );  
  }  
});  
var upload = multer({ storage : storage});
router.post('/profile-image-upload/:id', upload.single("imagefile"), async function(req, res, next) {
	// id and old_image_id from form post
	try {
		var oldFileName = req.body.image;
		var o_id = req.params.id;
		//console.log(oldFileName);
		if(req.file){

			var edituser = await userService.updateUser( { _id: o_id },
			{ $set: 
				{ 	imagefile: req.file.originalname, 
					  image: req.file.filename
			}
			});

			fs.unlink('./public/uploads/'+oldFileName, (err) => {
				//console.log('successfully deleted old image');
			});

			res.json({ success:1 , image: req.file.filename });
			}else{
				res.json({ success:0 });
			}
	} catch(e) {
		res.json({ success:0 });
	}

	});
router.post('/ajax/delete', async function(req, res, next) {
  try {
    var o_id = req.body.id;
    var result = await userService.updateUser({_id: o_id}, 
    { $set: { status: 0 } }
      ); 
    res.json({ success: 1 });
  } catch(e) {
    res.json({ success: 0 });
  }
});



module.exports = router;

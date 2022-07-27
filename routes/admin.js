var express = require('express');
const { default: mongoose } = require('mongoose');
const { response } = require('../app');
var router = express.Router();
const adminHelper=require("../helpers/adminHelpers")
let HosDetailsHelper=require("../helpers/hosp-Det-Helper")
let UserHelper=require("../helpers/user-helpers")
const { route } = require('./user');
const multer = require('multer');
const path = require('path');





/* GET users listing. */
router.get('/', function(req, res, next) {


res.render('admin/admin-login',{admin:true})

});

router.post('/adminPanel',(req,res)=>{  
  
  console.log(req.body);
  adminHelper.doLogin(req.body).then((response)=>{  
    if(response.status){

      // req.session.loggedIn=true  //(33)
      // req.session.user=response.user

      res.redirect('/admin/adminPanel')
    }else{
      res.redirect('/admin')
    }
  })

})

router.get('/adminPanel', function(req, res, next) {

//show hospital detail
  HosDetailsHelper.getHosDetails().then((response)=>{

// add category show
adminHelper.getCategory().then((data)=>{

 //show user details 
 UserHelper.getUser().then((userData)=>{

  // get Department details
  adminHelper.getDepartment().then((depData)=>{

console.log(depData);
console.log('sssssssssssss');

  res.render('admin/index',{admin:true, datas:data,response,userData,Depdata:depData})


})

})

})
})

});

// Add hospital

router.get('/add-hospital',(req,res)=>{

  res.render('admin/add-hospital',{admin:true})
})


//  Reject Hospital



router.get('/reject-Hospital/:id',(req,res)=>{

  let hospitalId=mongoose.Types.ObjectId(req.params.id)
  HosDetailsHelper.softRejectHos(hospitalId).then((response)=>{
    res.redirect('/admin/adminPanel')
  })
})


// aproved hospital details

router.get('/aproveBtn',(req,res)=>{

  res.render('admin/aprovedHos',{admin:true})
})




//  add category form post

router.post('/addCategory',(req,res)=>{  

  
  // console.log(req.body);
  adminHelper.addCategory(req.body).then((response)=>{  
    if(response){


      res.redirect('/admin/adminPanel')
    // }else{
    //   res.redirect('/login')
    }
  })
})

// Delete Category

router.get('/delete-category/:id',(req,res)=>{
  let catId=mongoose.Types.ObjectId(req.params.id);
  adminHelper.softDelet(catId).then((response)=>{
    res.redirect('/admin/adminPanel')
  })
})

// update-category


router.post('/update-category/:id',function(req,res){
  // let id=mongoose.Types.ObjectId(req.params.id)
  console.log(req.body)

  adminHelper.updateCategory(req.params.id,req.body)
    res.redirect('/admin/adminPanel')
  })


  // Add Departments


// Image Upload using Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/images/departmentImg/');
  },

  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      
  }
});

var upload = multer({ storage: storage })


  router.post('/addDepartment',upload.array('multi-files'),(req,res)=>{

    console.log(req.body);
    adminHelper.addDepartments(req.body,req.files).then((data)=>{
      console.log(data);
    console.log('aaaaaaaaaaaaaaaaaaaaaa');

    res.redirect('/admin/adminPanel')
  })
})







module.exports = router;

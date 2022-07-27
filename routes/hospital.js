var express = require('express');
var router = express.Router();
const doctorHelper=require("../helpers/doctor-helpers")
const adminHelperS=require("../helpers/adminHelpers")
const multer = require('multer');
const path = require('path');
const { response } = require('../app');
const { default: mongoose } = require('mongoose');
const hospDetHelper=require("../helpers/hosp-Det-Helper")
const aproveHos=require('../config/aproveHos')
let aproveEmail=require("../config/aproveHos");
const session=require('express-session')

let DocDepartment=[]



var fs = require('fs');
require('dotenv/config');
var bodyParser = require('body-parser');




// main hospital dashboard

router.get('/',(req,res)=>{

  // logined Hospital Id
  let HospId=mongoose.Types.ObjectId(req.session.HosId)
    // add doctor show
    hospDetHelper.getDoctor(HospId).then((data)=>{



      // shared hospital full details
      let HosFullDet=req.session.hosLog

      // get individual hospitals dashboard(passed the specific id from session)
      let LoggedHosName=req.session.hosName
     
      res.render('hospitalDashboard/hospital-dashboard',{ hospital:true,DoctorData:data,HosFullDet})


    })
  // })

})

// aprove hospital and send confirmation email

router.get('/aprove-Hospital/:id',(req,res)=>{

  let hospitalId=mongoose.Types.ObjectId(req.params.id)

     
  aproveEmail.EmailSend(hospitalId)

    hospDetHelper.AproveHospital(hospitalId).then((response)=>{
    res.redirect('/admin/adminPanel')

  })
})



// Hospital Registration Form

router.get('/hospitalReg-form',function(req,res){

  res.render('hospitalDashboard/hospitalReg-form',{hospital:true})
})

// Doctor Single page

router.get('/docSinglePage/:id',function(req,res){

  let DoctorId=mongoose.Types.ObjectId(req.params.id)
 
  hospDetHelper.getSingleDoctor(DoctorId).then((data)=>{

  res.render('hospitalDashboard/doctor-single',{hospital:true,DocSingleDet:data})
})
})

// Apoinment Page


router.get('/appoinmentPage/:id',function(req,res){

  let DoctorId=mongoose.Types.ObjectId(req.params.id)
  
req.session.docId=DoctorId

  hospDetHelper.getSingleDoctor(DoctorId).then((data)=>{

console.log(data);
console.log('44444444444444444444');

// this is from user.js
    let AvTimeSlots=req.session.TimeSlots

  res.render('hospitalDashboard/appoinment',{DoctorDet:data,AvTimeSlots})
  
})
})


// Add Doctor

router.get('/add-doctor',function(req,res){

  let HospId=req.session.HosId
  
  res.render('hospitalDashboard/add-doctor',{hospital:true,HospId}) 
})

// Doctor Image upload Page

// router.get('/upload-Img',(req,res)=>{


//       res.render('hospitalDashboard/imgUpload',{hospital:true})
   

// })


// Edit doctor details page

router.get('/edit-doctorDetails/:id',(req,res)=>{

let DocId=mongoose.Types.ObjectId(req.params.id)

doctorHelper.fetchDoctorData(req.params.id).then((EditDoc)=>{

      // get doctor old data
console.log()
        res.render('hospitalDashboard/update-doctorForm',{EditDoc,hospital:true}) 

})

})


// Doctor detail table

router.get('/doctor-details-table',(req,res)=>{


      // show doctor details on table
      doctorHelper.getDoctor().then((data)=>{

        // res.render('admin/index',{admin:true, datas:data})',{hospital:true}
      
        res.render('hospitalDashboard/Doctor-details-table',{ hospital:true,DoctorData:data})
  
      })

})

// DoctorsList

router.get('/DoctorsList/:id',(req,res)=>{
  let HospitalID=mongoose.Types.ObjectId(req.params.id)
  
  hospDetHelper.getDoctor(HospitalID).then((data)=>{
    
console.log(data);
console.log('uuuuuuuuuuuu');


    DocDepartment=data
    // redirected below get function
    res.redirect('/hospital/docDet')

  })
  
})

// 

router.get('/docDet',(req,res)=>{

console.log(DocDepartment);
  console.log('ccccccccccccccccccccc')

  res.render('hospitalDashboard/DoctorsList',{hospital:true ,DoctorData:DocDepartment})

  console.log('ccccccccccccccccccccc')

  
})

// From DoctorList page (filter post)
router.post('/department-filter',(req,res)=>{

  if(req.body.department){
  hospDetHelper.DepFilterData(req.body.department).then((data)=>{
    DocDepartment=data;
    res.json({status:true})

  })
  }
  if(req.body.ConsultationType){
    hospDetHelper.ConsFilterData(req.body.ConsultationType).then((ConsData)=>{
      DocDepartment=ConsData
      res.json({status:true})

    })

    }


  })





// Delet doctor

router.get('/delete-doctor/:id',(req,res)=>{

  let doctorId=mongoose.Types.ObjectId(req.params.id)
  doctorHelper.softDeleteDoc(doctorId).then((response)=>{
    res.redirect('/hospital')
  })
})


// Hospital login form

router.get('/hospital-login',(req,res)=>{

res.render('hospitalDashboard/hospitalLogin-form',{hospital:true})
})


//  Hospital Login Post

router.post('/hos-Login',(req,res)=>{

hospDetHelper.doHosLogin(req.body).then((response)=>{

  //hospital name saved in session
  req.session.hosName=response.hosName
let statusDetails=response.status
// hospital Full details saved in session
req.session.hosLog=response.hosLog
req.session.HosId=response.Id

  if(statusDetails){
    
    res.redirect('/hospital')
  }else{
    res.redirect('/hospital/hospital-login')
  }
})

})



// Image Upload using Multer

  
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/images/doctorImg/');
  },

  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      
  }
});

var upload = multer({ storage: storage })


// add Doctor

router.post('/addDoctor/:id',upload.array('multi-files'),(req,res)=>{ 

  
let HospitalId=mongoose.Types.ObjectId(req.params.id)

hospDetHelper.addDoctorDetails(req.body,req.files,HospitalId).then((response)=>{  
      if(response){
  
        res.redirect('/hospital')
      }else{
        res.redirect('/hospital/add-doctor')
      }
    })
  })


// Hospital Registration Form Post

router.post('/hospitalReg',upload.array('multi-files'),(req,res)=>{

      // console.log(req.body);
    hospDetHelper.addHospital(req.body,req.files).then((response)=>{


    if(response){


      res.redirect('/')
    }else{
      res.redirect('/hospital/hospitalReg-form')
    }
  })
})




// Update add Doctor form

router.post('/updateDoctor-Form',(req,res)=>{

// console.log(req.body);

doctorHelper.updateDoctorForm(req.body)

  res.redirect('/hospital')
})


//  add category form post

router.post('/addCategory',(req,res)=>{  

  
  // console.log(req.body);
  hospDetHelper.addCategory(req.body).then((response)=>{  
    if(response){


      res.redirect('/hospital')
    // }else{
    //   res.redirect('/login')
    }
  })
})

// Payment method form submition

// router.post('/appoinmentForm',(req,res)=>{
//   console.log(req.body);
//   console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
// })



  module.exports = router;

  
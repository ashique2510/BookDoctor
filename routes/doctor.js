var express = require('express');
var router = express.Router();
const doctorHelper=require("../helpers/doctor-helpers")
const adminHelperS=require("../helpers/adminHelpers")
const multer = require('multer');
const path = require('path');
const hospDetHelper=require("../helpers/hosp-Det-Helper")
const session=require('express-session');
const { route } = require('./user');
const userHelper=require("../helpers/user-helpers")
const { default: mongoose } = require('mongoose');

var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});




router.get('/',(req,res)=>{

    res.render('doctorDashboard/doctorLogin',{doctor:true})

})

router.get('/doctorDashboard',(req,res)=>{

    

let docUserName=req.session.doctorEmail

// show user appoinment details at doctor dashboard
    userHelper.showUserApp(docUserName).then((data)=>{  

        console.log(data);
        console.log('qqqqqqqqqqqqqq');

        
    res.render('doctorDashboard/doctor-dashboard',{doctor:true,appDetails:data})

})
})



// Add-Time slot page

router.get('/add-TimeSlot',(req,res)=>{

    res.render('doctorDashboard/add-TimeSlot')
})

// add time slot post !!!!!!!!!!!!!!!!!!!!!!!!1111!!!!!!!

router.post('/available-time',(req,res)=>{

    
// object destructuring 
let {availableDate,availableTime}=req.body


// convert array to key value pair 
var data = {};
availableTime.forEach(function(item, index) {
       data[item] = 'true';
});


let DocEmail=req.session.doctorEmail
 doctorHelper.addTimeSlot(data,availableDate,DocEmail);


    res.redirect('/doctor/add-TimeSlot')
})


// Doctor Login

router.post('/doctorLogin',(req,res)=>{

    req.session.doctorEmail=req.body.username
   
    doctorHelper.doctorLogin(req.body).then((data)=>{   

if(data.status){

    res.redirect('/doctor/doctorDashboard')
}else{
    res.redirect('/doctor')
}
})
})

// patient Profile at doctor panel
router.get('/patientProfile/:id',(req,res)=>{

let patientId=mongoose.Types.ObjectId(req.params.id)

userHelper.UserDetails(patientId).then((data)=>{

    res.render('doctorDashboard/patient-profile',{PatientData:data})
})
})

// Add prescription

router.get('/prescription/:id',(req,res)=>{

    let patientId=mongoose.Types.ObjectId(req.params.id)
      
userHelper.UserDetails(patientId).then((data)=>{

    console.log(data);
    console.log('33333333333333333')

    res.render('doctorDashboard/prescription',{PatientData:data})
})

})

// Prescription doctor submition
router.post('/prescriptionDet',(req,res)=>{

    console.log(req.body);
    let userId=mongoose.Types.ObjectId(req.body.userId)
    console.log('33333333444444444444433333333');

userHelper.addPrescription(req.body,userId).then((data)=>{



res.redirect('/')

})
})



module.exports = router;

var express = require('express');
var router = express.Router();
const userHelper=require("../helpers/user-helpers")
var sms=require('../config/verify')
let hospDetHelper=require('../helpers/hosp-Det-Helper');
const { default: mongoose } = require('mongoose');
const doctorHelper=require('../helpers/doctor-helpers')
const hospital=require('../routes/hospital');
const { route } = require('../app');
const multer = require('multer');
const path = require('path');
const adminHelper=require("../helpers/adminHelpers")


/* GET home page. */
router.get('/', function(req, res, next) {

  hospDetHelper.showHosAtHome().then((hosData)=>{

    let objectId=mongoose.Types.ObjectId('62c09bc78d871a594d97ff3b')

// let objectId=new ObjectId('62c09bc78d871a594d97ff3b')

    hospDetHelper.getDoctor(objectId).then((data)=>{

console.log(data);
console.log('yyyyyyyyyyyyyyyyyyyyyyyyy');


  // Check login or not
  let userLogged=req.session.Users
  
  res.render('user/index', {userLogged,hosData,DoctorDet:data});
});
})
})
// user sign up(form main page)

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})


router.get('/otpVerify',(req,res)=>{
  res.render('user/otpVerif')
})



// user login

router.get('/login',(req,res)=>{
  res.render('user/login') 

})

// user Logout

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

// User profile

router.get('/userProfile',(req,res)=>{

  let userId=req.session.Users._id
  let UserID=mongoose.Types.ObjectId(userId)

  console.log(UserID);
    console.log('88888888888');

  userHelper.getLoggedUserApp(UserID).then((data)=>{   

    console.log(data);
    console.log('999999999999');


  res.render('user/userProfile',{UserDet:data})
})
})


// sign up post(user Register)

router.post('/userRegister',(req,res)=>{

    req.session.userData = req.body
  sms.doSms(req.body).then((data)=>{
  if(data){
    res.redirect('/otpVerify')
  }else{
    res.redirect('/signup')
  }
  })
  
   
    
  })


  // Otp verfy

  router.post('/otpVerify',(req,res)=>{
    sms.otpVerify(req.body,req.session.userData).then((data)=>{
      if(data.valid){
        userHelper.doSignup(req.session.userData).then((response)=>{
        console.log(response);
        res.redirect('/login')
        })
        }else{
          res.redirect('/otpVerify')
        }


    })
  })

  


// user login

router.post('/login',(req,res)=>{  
  
  console.log(req.body);
  userHelper.doUserLogin(req.body).then((response)=>{  
    if(response.status){

      req.session.loggedIn=true  
      req.session.Users=response.Users
      

      res.redirect('/')
    }else{
      res.redirect('/login')
    }
  })

})

// appoinment Form

router.post('/appoinmentForm',(req,res)=>{

  console.log(req.body);
  console.log('kkkkkkxxxxxxxxxxxxxxxxxxxxxNNNNNNNNNN');

  let consultationFee=req.body.consultationFee
  let docId=mongoose.Types.ObjectId(req.body.doctorID)

  let userEmail=req.session.Users.email
  let selctedDate=req.body.selctedDate
  let time=req.body.time
  let DocUserName=req.body.DocUserName

  userHelper.getAvailableTimeId(docId,selctedDate).then((AvTimeId)=>{
let timeData;
  if('nine'==time){
    timeData={"docDetails.$[docDetails].availableTime.$[availableTime].nine":false}
  }
  else if('nineFifteen'==time){
     timeData={"docDetails.$[docDetails].availableTime.$[availableTime].nineFifteen":false}
  }
  else if('nineThirty'==time){
    timeData={"docDetails.$[docDetails].availableTime.$[availableTime].nineThirty":false}
 }
 else if('nineFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].nineFourtyFive":false}
}
else if('ten'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].ten":false}
}
else if('tenFifty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].tenFifty":false}
}
else if('tenThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].tenThirty":false}
}
else if('tenFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].tenFourtyFive":false}
}
else if('eleven'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].eleven":false}
}
else if('elevenFifty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].elevenFifty":false}
}
else if('elevenThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].elevenThirty":false}
}
else if('elevenFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].elevenFourtyFive":false}
}
else if('twelveThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].twelveThirty":false}
}
else if('twelveFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].twelveFourtyFive":false}
}
else if('one'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].one":false}
}
else if('oneFifty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].oneFifty":false}
}
else if('oneThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].oneThirty":false}
}
else if('oneFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].oneFourtyFive":false}
}
else if('two'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].two":false}
}
else if('twoThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].twoThirty":false}
}
else if('three'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].three":false}
}
else if('threeThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].threeThirty":false}
}
else if('four'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].four":false}
}
else if('fourThirty'==time){
     timeData={"docDetails.$[docDetails].availableTime.$[availableTime].fourThirty":false}
  }



  doctorHelper.addUserBooking(docId,selctedDate,timeData,AvTimeId);
  userHelper.addAppoinment(req.body,userEmail,docId,DocUserName).then((data)=>{
   
// get appoinment array id for payment purpose 
userHelper.getAppId(userEmail,time,selctedDate).then((appId)=>{
// we will get a array with 2 id. we want 1 id, so we sorted
 let AppID=appId[0].appoinmentForm._id

 console.log(req.body)
 console.log('gggggggggggg')

 
    if(req.body.paymentMethod=='Payment by the hospital'){   
res.json({status:true, payByHosSuccess:true})
    }

    else{
// create razorpay instance
userHelper.generateRazorpay(AppID,consultationFee).then((order)=>{

console.log(order);
console.log('kkkkkkkkkkkkkkkkkkk');

  res.json(order)

})

    }


})
})
})
})

//  get individual date based available time slot

router.post('/getIndDateandTime',(req,res)=>{

let selectedDate=req.body.date
// let isoFormateDate=new Date(req.body.date)


let DocId=mongoose.Types.ObjectId(req.session.docId)

  userHelper.GetIndDateandTime(selectedDate,DocId).then((data)=>{


    console.log(data);
    console.log('uuuuuuuuuuuuuussssssssssssssssssseeeeeeerrrrrrrrr');
    // this data saved in a session if we mention [0] it will get an object . array saving not get another page
req.session.TimeSlots=data[0]

    res.json({payByHosSuccess:true})
  })
})

// verify-payment (from appoinment hbs page)
router.post('/verify-payment',(req,res)=>{

  console.log(req.body);
  console.log('vvvvvvvvvvccccccc');

  userHelper.verifyPayment(req.body).then(()=>{
// if payment succerss full,change order status
userHelper.changePaymentStatus(req.body.receipt).then(()=>{

  console.log('payment success');
  console.log('EEEEEEEEEEEEEEEEEEE');

  res.json({status:true})
})
  }).catch((err)=>{
    console.log(err);
    console.log('eeeeeeeeeeeeee');

    res.json({status:'Payment Failed'})
  })

})

// test
router.get('/test',(req,res)=>{

  res.render('hospitalDashboard/test')
})

router.post('/Test',(req,res)=>{

  console.log(req.body);
  console.log('uuuuuuuuuuuuuuuuuugggggggggggg');

})
// Cancel booking

router.get('/cancelBooking',(req,res)=>{

// we passed this datas like req.query
var docId=req.query.doctorID
let DoctorId=mongoose.Types.ObjectId(docId)

var selctedDate=req.query.selctedDate
var time=req.query.time


let AppoinmentId=mongoose.Types.ObjectId(req.query._id)

  userHelper.SoftCancel(AppoinmentId).then((data)=>{
 
    //after the booking cancelation we want to show that appinment page !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 
    userHelper.getAvailableTimeId(DoctorId,selctedDate).then((AvTimeId)=>{
         
    

let timeData;
  if('nine'==time){
    timeData={"docDetails.$[docDetails].availableTime.$[availableTime].nine":true}
  }
  else if('nineFifteen'==time){
     timeData={"docDetails.$[docDetails].availableTime.$[availableTime].nineFifteen":true}
  }
  else if('nineThirty'==time){
    timeData={"docDetails.$[docDetails].availableTime.$[availableTime].nineThirty":true}
 }
 else if('nineFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].nineFourtyFive":true}
}
else if('ten'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].ten":true}
}
else if('tenFifty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].tenFifty":true}
}
else if('tenThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].tenThirty":true}
}
else if('tenFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].tenFourtyFive":true}
}
else if('eleven'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].eleven":true}
}
else if('elevenFifty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].elevenFifty":true}
}
else if('elevenThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].elevenThirty":true}
}
else if('elevenFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].elevenFourtyFive":true}
}
else if('twelveThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].twelveThirty":true}
}
else if('twelveFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].twelveFourtyFive":true}
}
else if('one'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].one":true}
}
else if('oneFifty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].oneFifty":true}
}
else if('oneThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].oneThirty":true}
}
else if('oneFourtyFive'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].oneFourtyFive":true}
}
else if('two'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].two":true}
}
else if('twoThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].twoThirty":true}
}
else if('three'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].three":true}
}
else if('threeThirty'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].threeThirty":true}
}
else if('four'==time){
  timeData={"docDetails.$[docDetails].availableTime.$[availableTime].four":true}
}
else if('fourThirty'==time){
     timeData={"docDetails.$[docDetails].availableTime.$[availableTime].fourThirty":true}
  }

  // again add if we cancel
  doctorHelper.addUserBooking(DoctorId,selctedDate,timeData,AvTimeId);



    res.redirect('/userProfile')
  })

})
})

// Update User Profile

router.post('/updateUserProfile/:id',(req,res)=>{

  let userId=mongoose.Types.ObjectId(req.params.id)
  
  userHelper.updateUserProfile(userId,req.body)
  
res.redirect('/userProfile')

})





// Image Upload using Multer( Upload User Image)

  
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/images/userImg/');
  },

  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      
  }
});

var upload = multer({ storage: storage })


// Upload User Image

router.post('/UserImgUpload/:id',upload.array('multi-files'),(req,res)=>{

let userId=mongoose.Types.ObjectId(req.params.id)

userHelper.UploadUserImg(userId,req.files)

res.redirect('/userProfile')

})

//  download prescription

router.get('/downloadPrescription',(req,res)=>{

  
  let userID=mongoose.Types.ObjectId(req.query.userID)
  console.log(userID);
  console.log('222222oooo2222222222');


  userHelper.getPrescription(req.query,userID).then((data)=>{
  // userHelper.UserDetails(patientId).then((data)=>{
    console.log(data);
    console.log('2222222222222222');
  
  res.render('user/downloadPrescription',{PreData:data})
})
// })
})
// Contact Area 

router.get('/contact',(req,res)=>{

  res.render('user/contact')
})

// Department Area


router.get('/Department',(req,res)=>{

  adminHelper.getDepartment().then((depData)=>{

  res.render('user/Departments',{DepData:depData})
})
})

// Department base doctor

router.get('/Dep-Doctor',(req,res)=>{

  console.log(req.query.depName);
  console.log('hhhhhhhhhhhhhhhhhhss');
  userHelper.getDepData(req.query.depName).then((data)=>{

    console.log(data);
    console.log('jjjjjjjjjjj');


  res.render('user/Dep-DoctorList',{DepDet:data})
})
})

module.exports = router;



var db = require("../config/connection");
const hospitalDetails = require("../models/hospitals-Details");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

module.exports = {
  // Hospital registration (add hospital)

  addHospital: (hospitalData,filedata) => {
    return new Promise(async (resolve, reject) => {


      hospitalData.password=await bcrypt.hash(hospitalData.password,10)

      let HospitalReg = await hospitalDetails.create({
        hospitalName: hospitalData.hospitalName,
        state: hospitalData.state,
        city: hospitalData.city,
        streetAddress: hospitalData.streetAddress,
        buildingNo: hospitalData.buildingNo,
        field: hospitalData.field,
        pincode: hospitalData.pincode,
        hospitalId: hospitalData.hospitalId,
        email: hospitalData.email,
        phoneNumber: hospitalData.phoneNumber,
        password:hospitalData.password,
        img: filedata,
        'isDeleted':false,
        'isVerified':'pending'

      });
      resolve(HospitalReg);
    });
  },

  // show hospital details in admin side

  getHosDetails: () => {
    return new Promise(async (resolve, reject) => {
      let displayHospital = await hospitalDetails.aggregate([
        {
          $project: {
            hospitalName: 1,
            state: 1,
            city: 1,
            streetAddress: 1,
            buildingNo: 1,
            field: 1,
            pincode: 1,
            hospitalId: 1,
            email: 1,
            phoneNumber: 1,
            password:1,
            img:1,
            isDeleted:1,
            isVerified:1
          },
        },{$match:{'isDeleted':false,'isVerified':'pending'}}
      ]);

      resolve(displayHospital)
    });
  },

// Reject hospitla

softRejectHos:(HosId)=>{

    return new Promise(async (resolve,reject)=>{
        let deletedDoc=await hospitalDetails.updateOne({_id:HosId},{$set:{isDeleted:true}})
        resolve(deletedDoc)
    })
},

// Aprove Hospital

AproveHospital:(hosId)=>{

  return new Promise(async (resolve,reject)=>{
    let aproveHos=await hospitalDetails.updateOne({_id:hosId},{$set:{'isVerified':'aproved'}})
    resolve(aproveHos)
})


},
// Hospital Login

doHosLogin:(hosData)=>{

  return new Promise(async(resolve,reject)=>{
      let loginStatus=false
      let response={}
      let hosLog=await hospitalDetails.findOne({email:hosData.email,isVerified:'aproved'})
      //show hospital name
      // console.log(hosLog.hospitalName);
      
      if(hosLog){
          bcrypt.compare(hosData.password,hosLog.password).then((status)=>{
              if(status){
                  console.log("login success");

                  response.hosLog=hosLog
                  response.status=true
                  response.Id=hosLog._id
                  //passed the 3 details
                  resolve(response)

              }else{
                  console.log("login failed");
                  resolve({status:false})
              }
          })
      }else{
          console.log("login failed");
          resolve({status:false})
      }
  })
},

 // Add Categories

 addCategory:(categoryData)=>{

  return new Promise(async(resolve,reject)=>{

      let category=await hospitalDetails.updateOne({hospitalName:'fathima hospital'},{$push:{category:{categoryName: categoryData.NameOfCategory,'isDeleted':false}}
      }).then((data)=>{
          // console.log(data)
          resolve(data)
      })
})
},

// Add doctor details

addDoctorDetails: (doctorData,filedata,HospitalId) => {

  return new Promise(async (resolve, reject) => {
    doctorData.password=await bcrypt.hash(doctorData.password,10)
    let doctorDetails = await hospitalDetails
      .updateOne({_id:HospitalId},{$push:{docDetails:{
        name: doctorData.name,
        department: doctorData.department,
        experiance: doctorData.experiance,
        address: doctorData.address,
        gender: doctorData.gender,
        state: doctorData.state,
        city: doctorData.city,
        birth_date: doctorData.birth_date,
        pincode: doctorData.pincode,
        consultationFee:doctorData.consultationFee,
        ConsultationType:doctorData.ConsultationType,
        email: doctorData.email,
        username:doctorData.username,
        password:doctorData.password,
        img: filedata,
        isDeleted: false,
       }}})
      .then((data) => {
        // console.log(data)
        resolve(data);
      });
  });
},

getDoctor: (HospId) => {

  return new Promise(async (resolve, reject) => {

    let displayDoctor = await hospitalDetails.aggregate([
    
      { $match: { isDeleted: false,_id:HospId}},{$unwind:"$docDetails"}
    ]);

    resolve(displayDoctor);

  

  });
},

// Get Single doctor details

getSingleDoctor: (DoctorId) => {

  return new Promise(async (resolve, reject) => {

    let displayDoctor = await hospitalDetails.aggregate([
    
      {$unwind:"$docDetails"},{$match: {'docDetails._id':DoctorId}}
    ]);

    resolve(displayDoctor);

  });
},

// show hospital at home
showHosAtHome:()=>{

  return new Promise(async (resolve, reject) => {

      let displayHos = await hospitalDetails.aggregate([
      
        { $match: {isVerified:'aproved'}}
      ]);
      resolve(displayHos);

  })
},
// get Doctor department wise for filter
DepFilterData:(department)=>{

  return new Promise(async(resolve,reject)=>{

    let getDepartment=await hospitalDetails.aggregate([
      {$unwind:"$docDetails"}, { $match: {'docDetails.department':department}},{$project:{docDetails:1}}
    ])
   
 
    resolve(getDepartment)

  })
},

// get Doctor Consultation wise for filter
ConsFilterData:(ConsultationType)=>{

  return new Promise(async(resolve,reject)=>{

    let getConsultation=await hospitalDetails.aggregate([
      {$unwind:"$docDetails"}, { $match: {'docDetails.ConsultationType':ConsultationType}},{$project:{docDetails:1}}
    ])
      
 
    resolve(getConsultation)

  })

  
},




};

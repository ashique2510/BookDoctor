var db = require("../config/connection");
const doctor = require("../models/doctor");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const session=require('express-session')
let hospitalDetails = require("../models/hospitals-Details");
const user=require('../models/user');
const { ObjectId } = require("mongodb");



module.exports = {
  

  // update doctor form

  updateDoctorForm: (id, formData) => {
    let editId = mongoose.Types.ObjectId(id);

    return new Promise(async (resolve, reject) => {
      let UpdateForm = await doctor.updateOne(
        { editId },
        {
          $set: {
            name: formData.name,
            department: formData.department,
            experiance: formData.experiance,
            address: formData.address,
            gender: formData.gender,
            state: formData.state,
            city: formData.city,
            birth_date: formData.birth_date,
            pincode: formData.pincode,
            email: formData.email,
          },
        }
      );
    });
  },

  // Doctor Delete

  softDeleteDoc: (docId) => {
    return new Promise(async (resolve, reject) => {
      let deletedDoc = await doctor.updateOne(
        { _id: docId },
        { $set: { isDeleted: true } }
      );
      resolve(deletedDoc);
    });
  },

  // Fetch doctorData for edit

  fetchDoctorData: (DocId) => {
    return new Promise(async (resolve, reject) => {
      let fetchDetails = await doctor.findOne({ _id: DocId });
      console.log(fetchDetails);

      resolve(fetchDetails);
    });
  },

  doctorLogin:(loginData)=>{

    return new Promise(async (resolve,reject)=>{

let response={}
let getDocDetails= await hospitalDetails.aggregate([

{$unwind:"$docDetails"},{$match:{'docDetails.username':loginData.username}}  
])

if(getDocDetails.length){

   bcrypt.compare(loginData.password,getDocDetails[0].docDetails.password).then((status)=>{

    if(status){
      response.status=true
      resolve(response)
     
  
    }else{
      resolve({status:false})
    }
   })
}
    })

  },
// add user User Booking to individual doctors

addUserBooking:(docId,selctedDate,timeData,AvTimeId)=>{

    return new Promise(async (resolve, reject) => {

      let UserBooking=await hospitalDetails.updateOne({
        "docDetails._id":docId
      },
      {
        $set: 
          timeData
      },
      {
        
        arrayFilters: [
          {
            "docDetails._id": {
              "$eq":docId
            }
          },
          {
            "availableTime._id": {
              "$eq": AvTimeId
            }
          }
        ]
      }
      )
      
console.log(UserBooking);
console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

    })
  },

// Add Time slot

addTimeSlot:(time,date,DocEmail)=>{

  return new Promise(async (resolve,reject) => {
    // combined both date and time using spread operator(in single objecg)
let result={availableDate:date,...time}

// for get hospital and doctor  
let getDocDetails= await hospitalDetails.aggregate([
  {$unwind:"$docDetails"},{$match:{'docDetails.username':DocEmail}}  
  ])
// for get hosp id
  let HospId=getDocDetails[0]._id
// push the details
let addDetails= await hospitalDetails.updateOne({
  _id:HospId,
  "docDetails.email":DocEmail,
},
{
  $push:{
    "docDetails.$.availableTime":result

  },


});
 
  })
},



};



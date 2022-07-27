var db = require("../config/connection");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const hospitalDetails = require("../models/hospitals-Details");
const Razorpay = require("razorpay");

const dotenv=require("dotenv")
dotenv.config()


// razorapay instance code
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  
});


module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      // console.log(userData)
      let valid = {};
      let email = await user.findOne({ email: userData.email });
      if (email) {
        valid.exist = true;
        resolve(valid);
      } else {
        userData.password = await bcrypt.hash(userData.password, 10);
        user
          .create({
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
            role: false,
          })
          .then((data) => {
            console.log(data);
            data.insertedId = true;
            resolve(data.insertedId);
          });
      }
    });
  },

  doUserLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let Users = await user.findOne({ email: userData.email });
      if (Users) {
        bcrypt.compare(userData.password, Users.password).then((status) => {
          if (status) {
            console.log("login success");

            response.Users = Users;
            response.status = true;
            resolve(response);
          } else {
            console.log("login failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("login failed");
        resolve({ status: false });
      }
    });
  },

  // Get user in admin panel show

  getUser: () => {
    return new Promise(async (resolve, reject) => {
      let displayUser = await user.aggregate([
        { $project: { name: 1, email: 1, phoneNumber: 1 } },
      ]);
      resolve(displayUser);
    });
  },

  // add appoinment details in to user db

  addAppoinment: (appData, userEmail, docId, DocUserName) => {
    return new Promise(async (resolve, reject) => {
      let status =
        appData.paymentMethod === "Payment by the hospital"
          ? "placed"
          : "pending";

      let appDetails = await user.updateOne(
        { email: userEmail },
        {
          $push: {
            appoinmentForm: {
              hospitalName:appData.hospitalName,
              department: appData.department,
              doctorID: docId,
              DocUserName: DocUserName,
              doctorName: appData.doctorName,
              selctedDate: appData.selctedDate,
              userName: appData.userName,
              phoneNumber: appData.phoneNumber,
              consultationFee: appData.consultationFee,
              paymentMethod: appData.paymentMethod,
              time: appData.time,
              PaymentStatus: status,
              BookedDate: new Date(),
              isCancel: false,
            },
          },
        }
      );

      console.log(appDetails);
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

      resolve(appDetails);
    });
  },
  // get appoinment array id for payment purpose

  getAppId: (userEmail, time, selctedDate) => {
    return new Promise(async (resolve, reject) => {
      let GetAppId = await user.aggregate([
        { $unwind: "$appoinmentForm" },
        {
          $match: {
            "appoinmentForm.selctedDate": selctedDate,
            "appoinmentForm.time": time,
          },
        },
        { $project: { appoinmentForm: { _id: 1 } } },
      ]);

      resolve(GetAppId);
    });
  },

  // show user appoinment details in doctor Panel
  showUserApp: (docUserName) => {
    return new Promise(async (resolve, reject) => {
      let displayPatiants = await user.aggregate([
        { $unwind: "$appoinmentForm" },
        { $match: { "appoinmentForm.DocUserName": docUserName } },
        {
          $project: {
            appoinmentForm: {
              userName: 1,
              phoneNumber: 1,
              selctedDate: 1,
              doctorName: 1,
              doctorID: 1,
              paymentMethod: 1,
              time: 1,
              status: 1,
              isCancel: 1,
            },
          },
        },
      ]);

      resolve(displayPatiants);
    });
  },
  // get isCancel details in doctor Panel
  // getIsCancel:(AppoinmentId)=>{

  //   return new Promise(async(resolve,reject)=>{
  //       let displayCancel=await user.updateOne({'appoinmentForm._id':AppoinmentId},{$unset:{'appoinmentForm.isCancel':true}})

  //       // resolve(displayCancel)
  //       console.log('wwwwwwww');

  //   })
  //   },

  // get logged user appoinment details
  getLoggedUserApp: (userId) => {
    return new Promise(async (resolve, Reject) => {
      let LoggedUserDet = await user.aggregate([
        { $match: { _id: userId } },
        { $unwind: "$appoinmentForm" },
        { $match: { "appoinmentForm.isCancel": false } },
      ]);
      resolve(LoggedUserDet);
    });
  },
  //  get individual date based available time slot

  GetIndDateandTime: (selectedDate, DocId) => {
    // convert to new key value pair
    var dictionary = {}; //create new object
    dictionary["availableDate"] = selectedDate; //set key1
    var availableDate = dictionary["availableDate"]; //get key1
    console.log(dictionary.availableDate);

    return new Promise(async (resolve, Reject) => {
      let getIndDateandTime = await hospitalDetails.aggregate([
        {
          $unwind: {
            path: "$docDetails",
          },
        },
        {
          $match: {
            "docDetails._id": DocId,
          },
        },
        {
          $unwind: {
            path: "$docDetails.availableTime",
          },
        },
        {
          $match: {
            "docDetails.availableTime.availableDate": dictionary.availableDate,
          },
        },
      ]);

      resolve(getIndDateandTime);
    });
  },

  // get available time array Id
  getAvailableTimeId: (docId, selctedDate) => {
    return new Promise(async (resolve, Reject) => {
      let getId = await hospitalDetails.aggregate([
        {
          $unwind: {
            path: "$docDetails",
          },
        },
        {
          $match: {
            "docDetails._id": docId,
          },
        },
        {
          $unwind: {
            path: "$docDetails.availableTime",
          },
        },
        {
          $match: {
            "docDetails.availableTime.availableDate": selctedDate,
          },
        },
      ]);
      // find id from getid if we mention [0] access the arry out put
      let findId = getId[0].docDetails.availableTime._id;
      resolve(findId);
    });
  },
  // create razorpay instance

  generateRazorpay: (AppID, consultationFee) => {
    // paisa to rupee multiplication
    Fee = Number(consultationFee * 100);
    return new Promise(async (resolve, reject) => {
      var options = {
        amount: Fee,
        currency: "INR",
        receipt: "" + AppID,
      };
      instance.orders.create(options, function (err, order) {
        resolve(order);
      });
    });
  },
  // Cancel Booking
  SoftCancel: (appId) => {
    return new Promise(async (resolve, reject) => {
      let cancelBooking = await user.updateOne(
        { "appoinmentForm._id": appId },
        { $set: { "appoinmentForm.$.isCancel": true } }
      );
      resolve(cancelBooking);
    });
  },
  // update UserProfile

  updateUserProfile: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      let update = await user.updateOne(
        { _id: userId },
        {
          $set: {
            name: data.name,
            email: data.email,
            address: data.address,
            location: data.location,
            phoneNumber: data.phoneNumber,
            age: data.age,
            gender: data.gender,
            hight: data.hight,
            weight: data.weight,
            Bloodgroup: data.Bloodgroup,
          },
        }
      );
    });
  },

  // upload user image
  UploadUserImg: (userId, filedata) => {
    return new Promise(async (resolve, reject) => {
      let update = await user.updateOne(
        { _id: userId },
        {
          $set: {
            img: filedata,
          },
        }
      );
    });
  },

  // get user details at doctor user profile
  UserDetails: (patientId) => {
    return new Promise(async (resolve, Reject) => {
      let patientDet = await user.aggregate([
        { $match: { _id: patientId } },
        { $unwind: "$appoinmentForm" },
        { $match: { "appoinmentForm.isCancel": false } },
      ]);
      resolve(patientDet);
    });
  },

  // verify Payment

  verifyPayment:(PayDetails)=>{

return new Promise(async(resolve,reject)=>{

  const {createHmac,} = require('node:crypto');
  let hmac = createHmac('sha256', 'p79u1cvnmA8xWfQqiDbcDXoD');
  // give order id and payment id
  hmac.update(PayDetails['payment[razorpay_order_id]']+'|'+PayDetails['payment[razorpay_payment_id]']);
  console.log(hmac.digest('hex'));
console.log('xxxxxxxxxxxxxxxx');
hmac=hmac.digest('hex')
if(hmac==PayDetails['payment[razorpay_signature]']){

  resolve()
}else{

  reject()
}


})

  },
// Add prescription in user collection
  addPrescription:(PreDet,userId)=>{

    return new Promise(async (resolve, reject) => {
    
      let preDetails = await user.updateOne(
        { _id: userId },
        {
          $push: {
            prescription: {
              hospitalName:PreDet.hospitalName,
              department:PreDet.department,
              doctorName:PreDet.doctorName,
              date:PreDet.selctedDate,
              time:PreDet.time,
              Symptoms1:PreDet.Symptoms1,
              Symptoms2: PreDet.Symptoms2,
              Symptoms3: PreDet.Symptoms3,
              Test1: PreDet.Test1,
              Test2: PreDet.Test2,
              Test3: PreDet.Test3,
              Advice: PreDet.Advice,
              Medicine1:PreDet.Medicine1,
              Medicine1Dose: PreDet.Medicine1Dose,
              Medicine2:PreDet.Medicine2,
              Medicine2Dose: PreDet.Medicine2Dose,
              Medicine3:PreDet.Medicine3,
              Medicine3Dose: PreDet.Medicine3Dose,
              Medicine4:PreDet.Medicine4,
              Medicine4Dose: PreDet.Medicine4Dose,
              Medicine5:PreDet.Medicine5,
              Medicine5Dose: PreDet.Medicine5Dose,
              
            },
          },
        }
      );

      console.log(preDetails);
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

      resolve(preDetails);
    });

  },
//  get prescription details in prescription page

getPrescription: (preData,userID) => {

  return new Promise(async (resolve, reject) => {
    let GetPreDet = await user.aggregate([
      { $unwind: "$prescription" },
      {
        $match: {
          "prescription.date": preData.selctedDate,
          "prescription.time": preData.time,
        },
      },
    ]);

    resolve(GetPreDet);

  });
},
// get departement based doctor details on dep-doctorList
getDepData:(depName)=>{

  return new Promise(async(resolve,reject)=>{

    let getDepartment=await hospitalDetails.aggregate([
      {$unwind:"$docDetails"}, { $match: {'docDetails.department':depName}},{$project:{docDetails:1}}
    ])
   
 
    resolve(getDepartment)

  })
},



};

const twilio = require('twilio');
const dotenv=require('dotenv');
dotenv.config()

// var instance=new twilio({
//      account_sid:process.env.TWILIO_ACCOUNT_SID,
//      auth_token:process.env.TWILIO_AUTH_TOKEN,
//      service_id:process.env.TWILIO_SERVICE_SID
// })

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_SERVICE_SID;

module.exports ={
    doSms:(noData)=>{
        let res = {}
        return new Promise(async(resolve,reject)=>{
            client.verify.services(serviceSid).verifications.create({
                to : `+91${noData.phoneNumber}`,
                channel:"sms"
            }).then((res)=>{
                res.valid =false
                resolve(res)
                console.log(res);
            })
        })
    },
    otpVerify:(otpData,nuData)=>{
        let resp = {}
        return new Promise(async(resolve,reject)=>{
            client.verify.services(serviceSid).verificationChecks.create({
                to: `+91${nuData.phoneNumber}`,
                code: otpData.otp
            }).then((resp)=>{
                
                console.log('verification failed');
                console.log(resp);
                resolve(resp)
            })
        })
    },
    adminLogin:()=>{
        let res = {}
        return new Promise(async(resolve,reject)=>{
            client.verify.services(serviceSid).verifications.create({
                to : `+91${9746790834}`,
                channel:"sms"
            }).then((res)=>{
                res.valid =false
                resolve(res)
                console.log(res);
            })
        })
    },
    otpAdminVerify:(otpData)=>{
        let resp = {}
        return new Promise(async(resolve,reject)=>{
            client.verify.services(serviceSid).verificationChecks.create({
                to: `+91${9746790834}`,
                code: otpData.otp
            }).then((resp)=>{
                console.log('verification failed');
                console.log(resp);
                resolve(resp)
            })
        })
    }
}
//  Email aproval message send

const nodemailer=require('nodemailer')
const hospDetails=require('../models/hospitals-Details')

const dotenv=require('dotenv');
dotenv.config()

// NODE_MAILER_USERNAME='quickdocbooking@outlook.com'
// NODE_MAILER_PASSWORD


const transporter=nodemailer.createTransport({

    service: "hotmail",
    auth :{
        user:process.env.NODE_MAILER_USERNAME,
        pass:process.env.NODE_MAILER_PASSWORD, 
        
    }
});


module.exports ={


EmailSend:(hosId)=>{

    return new Promise(async(resolve,reject)=>{
        let hospitalId=await hospDetails.findOne({_id:hosId})
        let emailDetails=hospitalId.email
        let hosName=hospitalId.hospitalName

        // let HosSessionId=req.session.hospitalId

    const options={

        from: "quickdocbooking@outlook.com",
        to: emailDetails,
        subject:"Hospital Rgistratoin",
        text:`!!!!Congratulations!!!!..., Your hospital ${hosName} registration has been aproved...  Welcome to india largest online doctor booking platform, Please contact our team immediately, Thank You !!!`
    }


transporter.sendMail(options, function(err,info){

    if(err){
        console.log(err)
        return
    }
    console.log("Sent :"+ info.response);
})

})


},



}
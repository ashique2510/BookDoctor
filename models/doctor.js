const mongoose= require('mongoose')
// const Schema=mongoose.Schema;


const doctorSchema =new mongoose.Schema({
    
    // userEmail:String,
    // userName:String,
    // phoneNumber:String,
    // paymentMethod:String,
    // date:String,
   
    
})

const doctor=mongoose.model('Doctor',doctorSchema)
module.exports=doctor
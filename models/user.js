const mongoose =require('mongoose')
const Schema=mongoose.Schema;

const userSchema=new Schema({
    
    name:String,
    email:String,
    phoneNumber:String,
    password:String,
    address:String,
    location:String,
    age:String,
    gender:String,
    hight:String,
    weight:String,
    Bloodgroup:String,
    img:Array,

    appoinmentForm:[{
        hospitalName:String, 
        department:String,
        doctorID:String,
        DocUserName:String,
        doctorName:String,
        selctedDate:String,
        userName:String,
        phoneNumber:String,
        consultationFee:String,
        paymentMethod:String,
        time:String,
        PaymentStatus:String,
        BookedDate:Date,
        isCancel:Boolean,

    }],

    prescription :[{
        hospitalName:String,
        department:String,
        doctorName:String,
        date:String,
        time:String,
        Symptoms1:String,
        Symptoms2:String,
        Symptoms3:String,
        Test1:String,
        Test2:String,
        Test3:String,
        Advice:String,
        Medicine1:String,
        Medicine1Dose:String,
        Medicine2:String,
        Medicine2Dose:String,
        Medicine3:String,
        Medicine3Dose:String,
        Medicine4:String,
        Medicine4Dose:String,
        Medicine5:String,
        Medicine5Dose:String,

    }]


})
const user=mongoose.model('user',userSchema)
module.exports=user
const mongoose= require('mongoose')
// const Schema=mongoose.Schema;


const hospitalDetailsSchema =new mongoose.Schema({
    
    
        hospitalName:String,
        state:String,
        city:String,
        streetAddress:String,
        buildingNo:String,
        field:String,
        pincode:String,
        hospitalId:String,
        phoneNumber:String,
        email:String,
        password:String,
        isVerified:String,
        isDeleted:Boolean,
        img: Array,


        // category:[{
        //         categoryName:String,
        //         isDeleted:Boolean
        //     }],

        docDetails:[{   
            name:String,
            department:String,
            experiance:String,
            address:String,
            gender:String,
            state:String,
            city:String,
            birth_date:String,
            pincode:String,
            consultationFee:String,
            ConsultationType:String,
            email:String,
            username:String,
            password:String,
            isDeleted:Boolean,
            img: Array,

            availableTime:[{

             availableDate:String,
                nine:Boolean,
                nineFifteen:Boolean,
                nineThirty:Boolean,
                nineFourtyFive:Boolean,
                ten:Boolean,
                tenFifty:Boolean,
                tenThirty:Boolean,
                tenFourtyFive:Boolean,
                eleven:Boolean,
                elevenFifty:Boolean,
                elevenThirty:Boolean,
                elevenFourtyFive:Boolean,
                twelveThirty:Boolean,
                twelveFourtyFive:Boolean,
                one:Boolean,
                oneFifty:Boolean,
                oneThirty:Boolean,
                oneFourtyFive:Boolean,
                two:Boolean,
                twoThirty:Boolean,
                three:Boolean,
                threeThirty:Boolean,
                four:Boolean,
                fourThirty:Boolean,        
              }],


     }],



    
})

const hospitalDetails=mongoose.model('HospitalDetails',hospitalDetailsSchema)
module.exports=hospitalDetails
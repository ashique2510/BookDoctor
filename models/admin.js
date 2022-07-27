const mongoose =require('mongoose')
const Schema=mongoose.Schema;

const adminSchema=new Schema({
    
    email:String,
    password:String,

    category:[{
        categoryName:String,
        isDeleted:Boolean
    }],

    departments:[{
        departmentName:String,
        description:String,
        img:Array,
    }]
    
})



const admin=mongoose.model('admin',adminSchema)
module.exports=admin
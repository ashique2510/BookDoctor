const mongoose =require('mongoose')
mongoose.connect("mongodb://localhost/doctorDb")

.then(()=>{
    console.log('Connection Successfull');
}).catch((e)=>{
    console.log('No Connection');
})

// const User =require("../models/user")

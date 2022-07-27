var db=require('../config/connection')
const admin=require('../models/admin')
const bcrypt=require('bcrypt')
const mongoose = require('mongoose')



module.exports={


    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user=await admin.findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("login success");

                        response.user=user
                        response.status=true
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

            let category=await admin.updateOne({},{$push:{category:{categoryName: categoryData.NameOfCategory,'isDeleted':false}}
            }).then((data)=>{
                // console.log(data)
                resolve(data)
            })
    })
},

//  For ge category from database and delet settup
getCategory:()=>{

    return new Promise(async(resolve,reject)=>{
        let displayCategory=await admin.aggregate([{$project:{_id:0,category:{$filter:{input:'$category',as:'category',cond:{$eq:['$$category.isDeleted',false,]},},},}}])

        resolve(displayCategory[0])
        // console.log(displayCategory);


    })
},

// Soft delet

softDelet:(prodId)=>{
    return new Promise(async (resolve,reject)=>{
        let deletedSoft=await admin.updateOne({'category._id':prodId},{$set:{'category.$.isDeleted':true}})
        resolve(deletedSoft)
    })
},

// Update-Category

updateCategory:(id,categoryData)=>{
    let edid=mongoose.Types.ObjectId(id)
    // console.log("kiiti"+id)
    let edname = categoryData.NameOfCategory
    return new Promise(async(resolve,reject)=>{
        let updateCategoryOne=await admin.updateOne({'category._id':edid},{$set:{'category.$.categoryName':edname}})
        console.log(updateCategoryOne)
    })

},

// Add Departments

addDepartments:(Data,filedata)=>{

    return new Promise(async(resolve,reject)=>{

        let Department=await admin.updateOne({},{$push:{departments:{departmentName: Data.departmentName,description:Data.description,img:filedata}}
        }).then((data)=>{
            // console.log(data)
            resolve(data)
        })
})
},

// get department details

getDepartment: () => {

    return new Promise(async (resolve, reject) => {
  
      let displayDep = await admin.aggregate([
      
        {$unwind:"$departments"}
      ]);
  
      resolve(displayDep);
  
    
  
    });
  },

}
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status: {
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
      },
    confirmationCode:{ 
        type: String, 
        unique: true 
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/tnave/image/upload/v1620915518/no-image_cragat.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User", userSchema)


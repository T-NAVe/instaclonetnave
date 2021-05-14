const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId, ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId, ref:"User"}
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true})
//Object id makes a reference to User colection, searching for that id
//This is how relations works in mongo

mongoose.model("Post", postSchema)
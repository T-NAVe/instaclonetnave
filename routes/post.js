const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost', requireLogin,(req,res)=>{
    Post.find()
    //populate calls relatinated objects
    //we can pass a second argument so select wich fields we want
    .populate("postedBy", "_id name pic")
    .populate({path:'comments.postedBy', select:'_id name', model: 'User' })
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/getsubpost', requireLogin,(req,res)=>{
    //if postedBy is present in following list
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name pic")
    .populate({path:'comments.postedBy', select:'_id name', model: 'User' })
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost', requireLogin,(req,res)=>{
    const {title, body, pic} = req.body
    if(!title || !body ||!pic){
        return res.status(422).json({error:"Please add all the fields"})
    }
    console.log(req.user)
    //make password undefiend so we don't show it on the response
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost', requireLogin,(req,res)=>{
    
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .sort('-createdAt')
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{new:true})
    .populate("postedBy", "_id name")
    .populate({path:'comments.postedBy', select:'_id name', model: 'User' })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new:true})
    .populate("postedBy", "_id name")
    .populate({path:'comments.postedBy', select:'_id name', model: 'User' })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })//above syntax should work but it doesn't so after some research i found this more exact syntax works no problem
    .populate({path:'comments.postedBy', select:'_id name', model: 'User' })
    .populate("postedBy", "_id name")
    .exec((err,result)=>{
        
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})
router.put('/uncomment', requireLogin,(req,res)=>{

    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:{_id:req.body.commentId}}
    },{
        new:true
    })//above syntax should work but it doesn't so after some research i found this more exact syntax works no problem
    .populate({path:'comments.postedBy', select:'_id name', model: 'User' })
    .populate("postedBy", "_id name")
    .exec((err,result)=>{
        
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString === req.user._id.toString){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router
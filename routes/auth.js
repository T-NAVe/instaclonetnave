const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bctypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET, USER, PASS} = require('../config/keys')
const nodemailer = require('nodemailer')
const {htmlTemplate, resetTemplate} = require('./html')
const crypto = require('crypto')

//import values from keys folder
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:USER,
        pass:PASS
    }
})


router.post('/signup',(req,res)=>{;
    const {name, email, password, pic} = req.body
    if(!email || !name || !password){
        return res.status("422").json({error:"please add all the fields"})        
    }
    if(email.length > 320 ){
        return res.status("422").json({error:"Invalid Email"})
    }
    if(name.length > 30){
        return res.status("422").json({error:"Name is too long"})
    }
    //password validation
    const validate = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,15}$/
    if(!password.match(validate)){
        return res.status("422").json({error:"Password should be 8-15 characters long and contain at least 1 upper case and 1 lower case character and 1 digit"})
    }

    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status("422").json({error:"user already exist with that email"})
        }
        bctypt.hash(password, 12)
        .then(hashedpassword=>{
                const token = jwt.sign({email},JWT_SECRET)
                const user = new User({
                    email,
                    password:hashedpassword,
                    name,
                    pic,
                    confirmationCode: token
                })
                user.save()
                .then(user=>{
                    const html = htmlTemplate(user.name, user.confirmationCode)
                    //import this from external file to reduce code function html
                    transporter.sendMail({
                        to:email,
                        from:"lucapierrot@gmail.com",
                        subject:"signup success",
                        html
                    }).catch(err=>console.log(err))
                    res.json({message:"Success! Confirm your email address"})
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin', (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status("422").json({error:"Please provide email and password"})
    }
     
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status("422").json({error:"Invalid Email or password"})
        }
        if (savedUser.status != "Active") {
            return res.status(401).send({
              error: "Pending Account. Please Verify Your Email!",
            });
          }
        bctypt.compare(password,savedUser.password, (err, doMatch)=>{
            if(doMatch){
                //res.json({message:"successfully signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following, pic} =savedUser
                res.json({token, user:{_id,name,email,followers,following, pic}})
            }else{
                console.log(err)
                return res.status("422").json({error:"Invalid Email or password"})
            }
        })
    })
    .catch(err=>{console.log(err)})
})

router.get('/auth/confirm/:confirmationCode',(req,res)=>{
    User.findOne({
        confirmationCode: req.params.confirmationCode,
      })
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
    
          user.status = "Active";
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.json({message:"Email confirmed"})
          });
        })
        .catch((e) => console.log("error", e));
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32, (err, buffer)=>{
        if(err)console.log(err)
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist"})
            }
            user.resetToken = token
            //set expiration date to one hour from creation
            user.expireToken = Date.now() + 3600000
            user.save().then((user=>{
                const html = resetTemplate(user.name, token)
                transporter.sendMail({
                    to:user.email,
                    from:"lucapierrot@gmail.com",
                    subject:"password reset",
                    html
                })
                res.json({message:"Check your inbox"})
            }))
        })
        
    })
})
router.post('/new-password',(req, res)=>{
    const newPassword = req.body.password
    const userToken = req.body.token
    const validate = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,15}$/
    if(!newPassword.match(validate)){
        return res.status("422").json({error:"Password should be 8-15 characters long and contain at least 1 upper case and 1 lower case character and 1 digit"})
    }
    //$gt greater than
    User.findOne({resetToken:userToken, expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again, link has expired"})
        }
        bctypt.hash(newPassword, 12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then(user=>{
                res.json({message:"Password changed successfully"})
            })
        })
    }).catch(err=>console.log(err))
})

module.exports = router
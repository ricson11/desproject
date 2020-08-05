const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');
const mongoose = require('mongoose');


const multer =require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/photos')
    },
   /* filename:function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now())
    },*/
    filename: function(req, file, cb){
        const ext = file.mimetype.split('/')[1];
     cb(null ,file.fieldname +'_'+ `${Date.now()}.${ext}`);
          //cb(null,  file.fieldname +'_'+ Date.now() + '.'+ext);
         }
    
});
function fileFilter(req, file, cb){
    if(file.mimetype ==='image/jpg' || file.mimetype==='image/jpeg'
    || file.mimetype==='image/png'){
        cb(null, true)
    }else{
        cb(new Error('image is not supported'), false)
    }
}
var upload = multer({storage:storage, fileFilter:fileFilter,
     limit:{filesize:1000000}})


     router.get('/register',(req, res)=>{
        res.render('users/register')
    })
    
    router.get('/login',(req, res)=>{
        res.render('users/login')
    })
    router.post('/login',(req, res, next)=>{
        passport.authenticate ('local',{
            successRedirect:'/uploadings',
            failureRedirect:'/login',
            failureFlash: true
        })(req, res, next);
    })
    
     
    router.post('/register',upload.single('photo'),(req, res, )=>{
        let errors = [];
        if(req.body.password != req.body.password2){
            errors.push({text: 'Password do not match'})
    
        }
        if(req.body.password.length < 4){
            errors.push({text: 'Password must be at least 4 characters'})
        }
        if(errors.length>0){
            res.render('users/register',{
    
                errors:errors,
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                password2:req.body.password2,
                photo:'/photos/'+req.file.filename,

            });
        }else{
            User.findOne({email:req.body.email, username:req.body.username})
            .then(user=>{
               if(user){
                req.flash('error_msg', 'This email or username already registered, login')
                res.redirect('/login')
               } else{
                   const newUser = new User({
                       username:req.body.username,
                       email:req.body.email,
                       password:req.body.password,
                       photo:'/photos/'+req.file.filename,
                   });
                     bcrypt.genSalt(10, (err, salt)=>{
                         bcrypt.hash(newUser.password, salt, (err,hash)=>{
                             if(err) throw err;
                             newUser.password = hash;
                             new User(newUser)
                             .save()
                             .then(user=>{
                                 req.flash('success_msg', 'Your are now registered and can login'+req.body.username)
                                 res.redirect('/login');
                             })
                             .catch (err=>{
                                console.log(err);
                                return;
                            })
                         })
                     })
               }
            })
        }
    })
    
    router.get('/users/logout',(req,res,next)=>{
        req.logout();
        req.flash('success_msg', 'you logged out!');
        res.redirect('/')
    })
    

module.exports = router;
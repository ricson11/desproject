const express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const router  = express.Router();

require('../models/Contact');


router.post('/contacts', (req, res)=>{
    const newContact={
        name: req.body.name,
        email:req.body.email,
        username:req.body.username,
    }
    new Contact (newContact)
    .save()
    .then(contacts=>{
      
    
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    service:'Gmail',
     auth: {
     user: process.env.GMAIL_EMAIL, // generated ethereal user
     pass: process.env.GMAIL_PASS, // generated ethereal password
   }
 });
  
  
  transporter.use('compile', hbs({
      viewEngine:{
          defaultLayout:undefined,
          partialsDir:path.resolve('./src/resources/email/')
      },
      viewPath: path.resolve('./views'),
      extName: '.handlebars'
  }));

 // send mail with defined transport object
 var mailOptions={
    
   from:process.env.GMAIL_EMAIL,// list of receivers
   to:req.body.email ,// list of receivers
   subject:"Your registration details of NaijaLand", // Subject line//
  // text: `${req.body.name} - ${req.body.email}`, // plain text body
   replyTo:req.body.email,
   //template:'email',
    html: `<b style="color:red"><h1>welcome boss, the below is your details</h1></b>
       <p>name:${req.body.name}</p>
       <p>email:${req.body.email}</p>
       <p>username:${req.body.username}</p>
       <b style="color:green"><p>regards from all us here at NaijaLand.com</p</b>
       <p>signed desto</p>`,
      // template:'email',

 };
 transporter.sendMail(mailOptions, function(error, info){
     if (error){
         console.log(error)
         res.redirect('/errors')
     }else{
         console.log('email sent' + info.response);
         res.redirect('/')
     }
 })
 res.redirect('/')
})
 
})









module.exports = router
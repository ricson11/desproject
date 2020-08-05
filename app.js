const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
const multer = require('multer');
const path = require('path')
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash')
require('./config/passport')(passport)
const{ensureAuthenticated}=require('./helpers/auth')
const env = require('dotenv').config();
const hbs = require('nodemailer-express-handlebars'); //for nodemailer html template 
//require('./test');
const app =express();
mongoose.promise = global.promise;

mongoose.connect('mongodb://localhost/uploading',{
    useNewUrlParser:true, useUnifiedTopology:true
})
.then(()=>console.log('mongodb fully connected'))
.catch(err=>console.log(err))


app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

app.engine('handlebars', exphbs({
    defaultLayout:'main'
}))
app.set('view engine', 'handlebars');

require('./models/Uploading');
require('./models/Contact');
require('./models/Banner');
require('./models/User');

require('./models/Comment');

require('./config/passport')(passport);


app.use(passport.initialize())

app.use(passport.session())


app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(flash())

app.use(function(req, res,next){
       res.locals.success_msg=req.flash('success_msg');
       res.locals.error_msg=req.flash('error_msg');
       res.locals.error=req.flash('error');
       //content that will be allowed to show when user login or out//
       res.locals.user=req.user || null;
       next();
   });




//require('./models/Comment');

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, 'public/folds')
    },
   filename: function(req, file, cb){
   const ext = file.mimetype.split('/')[1];
cb(null ,file.fieldname +'_'+ `${Date.now()}.${ext}`);
     //cb(null,  file.fieldname +'_'+ Date.now() + '.'+ext);
    }
   
});
  function fileFilter (req, file,cb){
      if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'
       || file.mimetype === 'image/png'){
          cb(null, true)
      }else{
          cb(new Error ('image uploaded is not of jpeg/jpg or png'), false);
      }

}

var upload = multer({storage:storage, fileFilter:fileFilter})
/*var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb){
    // const ext = file.mimetype.split('/')[1];

     cb(null,  file.originalname +'_'+ Date.now() );
    }
});
var upload = multer({storage:storage})*/

app.post('/uploadings', upload.single('image'),(req, res)=>{
     /* req.body.images=[];
      req.files.map(el=>{
          let currentImage = el.filename
          req.body.images.push(currentImage)
      })*/
   
    const newUploading={
        title:req.body.title,
        url:req.body.url,
        
        image:'/folds/' +req.file.filename
    }

    new Uploading (newUploading)
    .save ()
    .then(uploading=>{
        res.redirect('/uploadings')
      //console.log(req.files)
    })

})
   

app.get('/',async(req, res)=>{
    const uploadings = await Uploading.find({}).sort({date:-1}).limit(5)
    const posts = await Uploading.find({}).sort({date:-1}).limit(1)
    const features = await Uploading.find({}).sort({date:-1}).skip(1).limit(1)
    res.render('index',{uploadings, posts, features})
})

app.get('/uploadings',async(req, res)=>{
    const uploadings = await Uploading.find({}).limit(3)
   
        res.render('index',{uploadings});
})

app.post('/uploadings/comment/:id', (req, res)=>{
    Uploading.findOne({_id:req.params.id})
    .then(uploading=>{
        const newComment={
            commentBody: req.body.commentBody,
            commentDate: req.body.commentDate
        }
        uploading.comments.unshift(newComment)
        uploading.save()
        .then(uploading=>{
            res.redirect('/uploadings/more')
        })
    })
})
app.get('/uploadings/comment/:id', (req, res)=>{
    Uploading.findOne({_id:req.params.id})
    .then(uploading=>{
        res.render('uploadings/more',{
            uploading: uploading
        })
    })
})


app.get('/add', (req, res)=>{
    res.render('uploadings/add')
})
app.get('/uploadings/:id',async(req, res, next)=>{
    try{
        const comment =await Comment.find({}).sort({commentDate:-1}).populate('uploading')
    const uploading  = await Uploading.findOne({_id:req.params.id}).populate('comments')
    res.render('uploadings/more', {uploading, comment})
}
 catch(err){
     console.log(err.message)
     return next(err)
 }
});


   process.env.NODE_TLS_REJECT_UNAUTHORIZED='0' //this will enable incase of security in node js
   /* app.post('/contacts', (req, res)=>{
   

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
        <p>name:${req.body.name}</p>
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
  

})*/

app.post('/contacts', (req, res)=>{
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
    
   from:/*'admin <noreply.process.env.GMAIL_EMAIL>',*/process.env.GMAIL_EMAIL,
   to:process.env.GMAIL_EMAIL ,// list of receivers
   subject:"Your registration details of NaijaLand", // Subject line//
  // text: `${req.body.name} - ${req.body.email}`, // plain text body
   //replyTo:req.body.email,
   //template:'email',
    /*html: `<b style="color:red"><h1>welcome boss, the below is your details</h1></b>
       <p>name:${req.body.name}</p>
       <p>email:${req.body.email}</p>
       <p>username:${req.body.username}</p>
       <a href="http://localhost:1200/features">check our posts</a>
       <b style="color:green"><p>regards from all us here at NaijaLand.com</p</b>
       <p>signed desto</p>`,*/
      template:'email',

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


app.get('/errors',(req, res)=>{
    res.render('errors')
})
app.get('/contacts/add', (req, res)=>{
    res.render('contacts/add')
})
app.use('/', require('./routes/comment'));
//app.use('/', require('./routes/contact'));
app.use('/', require('./routes/banner'));
app.use('/', require('./routes/user'));


app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/dist', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/dist', express.static(__dirname + '/node_modules/popper.js/dist'));


const port = process.env.myPort;

app.listen(port,()=>console.log('Server is running on port', + port));




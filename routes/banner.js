const express = require('express');
const multer = require('multer');
const router = express.Router()

require('../models/Uploading');
require('../models/Banner');
require('../models/Contact');

var storage = multer.diskStorage({

destination:function(req,file,cb){
    cb(null, 'public/banners')
},
filename: function(req, file, cb){
    const ext = file.mimetype.split('/')[1];
 cb(null ,file.fieldname +'_'+ `${Date.now()}.${ext}`);
    // cb(null,  file.fieldname +'_'+ Date.now() + '.'+ext);
 //cb(null,  file.fieldname +'_'+ Date.now() );
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

router.get('/addban', (req, res)=>{
    res.render('banners/addban');
})

router.get('/page', async(req, res)=>{
    const page=parseInt(req.query.page)||1
    const limit=parseInt(req.query.limit)||20
    skip = (page-1)*limit;
    lastPage = page*limit
    const prev=(page-1)
    const next=(page+1)

    counts = await Uploading.countDocuments()
    const blogs = await Uploading.find({})
    .skip(skip).limit(limit)
    const paginate = {}

    if(skip>0){
      paginate.prev={
          page:page-1,
          limit:limit
      }
    }
    if(next<lastPage){
        paginate.next={
            page:page+1,
            limit:limit
        }
      }
       if(next>lastPage){
           next = false;
       }
      
    res.render('banners/page',{blogs, lastPage, skip, page,limit,counts, next,prev});
})

router.get('/place',async(req, res)=>{

    var perPage=parseInt(req.query.perPage)||50
    var page = parseInt(req.query.page)||1
    var start = (page-1)
    var end = (page+1)
   


    const count= await Uploading.countDocuments()
    pages = Math.ceil(count/perPage)

    const features = await Uploading.find({})
    .sort({date:-1}).skip((perPage * page)-perPage)
    .limit(perPage)  
    
    const pagination={}
     if(end<features.length){
        pagination.next={
        page:page+1,
        perPage:perPage
    }
    } if(start>0){
        pagination.previous={
        page:page-1,
        perPage:perPage

    }
    }
     
      
     if(end>pages){
         end=false;
     }
     
     const contacts = await Contact.find({}).sort({date:-1}).limit(3)

     const posts = await Uploading.find({}).sort({date:-1}).limit(3)   
          res.render('banners/place',{
                 page,
                pages /*Math.ceil(count/perPage)*/,
                features,
                start:start,
                end:end,
                posts:posts,
                count,
                contacts,
               
            })
        })
    



router.post('/banners',upload.any(),(req, res)=>{
     
      //console.log(req.files);
      for(var i =0; i < req.files.length; i++){
          console.log(req.files[i])
      }
      
        
    const newBanner={
        photo:'/banners/'+req.files[i].filename,
        // img:'/banners/'+req.files['img'][i].filename,
        urlBan: req.body.urlBan,
    }
    new Banner (newBanner)
    .save()
    .then(banners=>{
         console.log(req.files)
        res.redirect('banners')
        //res.send(files)
    })
//}
})
router.get('/home', async(req, res)=>{
    const banners = await Banner.find({}).sort({date:-1})

    res.render('banners/home',{banners})
})

router.get('/banners',async(req, res)=>{
    const banners = await Banner.find({}).sort({date:-1})


    res.render('banners/home',{banners})
})








module.exports=router;
const express=require('express');
const router=express.Router();

require('../models/Uploading');
 require('../models/Comment');


/*router.get("/comadd", (req, res)=>{
     console.log(req.params.id)
     Uploading.findById(req.params.id, function(err, uploading){
         if(err){
             console.log(err)
         }else{
            res.render('comments/comadd',{uploading:uploading})

         }
     })
    
    
})*/
router.get('/uploadings/comments/:id',async(req, res)=>{
    console.log(req.params.id)
    const uploading = await Uploading.findOne({_id:req.params.id})
    res.render('comments/comadd', {uploading})
});


/*router.post('/uploadings/:uploadingId/comments', function(req, res){
    Uploading.findOne({_id:req.params.id})
      //  comment.save()
       
         .then(uploading=>{
               const newComment={
                   commentBody:req.body.commentBody,
               }
               uploading.comments.unshift(newComment)
                uploading.save();
         })
         .then(uploading=>{
             console.log(uploading)
         })
         .catch(err=>{
             console.log(err.message)
         })
    }) */

    /*router.post('/uploadings/comments/:id', (req, res)=>{
              const comment={
                  commentBody:req.body.commentBody,
              }
              Comment.create(comment, (err, comment)=>{
                  if(err){
                      console.log(err)
                  }else{
                      Uploading.findById(req.params.id, (error, uploading)=>{
                          uploading.comments.push(comment);
                          console.log(comment);
                          uploading.save((error)=>{
                              if(error){
                                  console.log(error);
                              }else{
                                  res.redirect('/uploadings/'+uploading._id)
                              }
                          })
                      })
                  }
              })
         });*/


         router.post('/uploadings/comments/:id', (req, res)=>{
               const comment={
                   commentBody:req.body.commentBody,
                   uploading:req.params.id,
               }

                Comment.create(comment, (err, comment)=>{
                    if(err){
                        console.log(err)
                    }else{
                        Uploading.findById(req.params.id, (err, uploading)=>{
                            if(err){
                                console.log(err)
                            }else{
                                uploading.comments.unshift(comment)
                                uploading.save((err)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log(comment)
                                        res.redirect('/uploadings/'+uploading._id)
                                    }
                                });
                            }
                        })
                    }
                })
         })
  

    module.exports=router;
const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const UploadingSchema = new Schema({

    title:{
        type:String,
        required:true
        
    },
    
     
    image:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    url:{
        type:String,

    },
    /*comments:[{
        commentBody:{
            type:String,
        },
        commentDate:{
            type:Date,
            default:Date.now
        }
    }]*/
     comments:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'comments'
     }],
     
     
})


module.exports = Uploading = mongoose.model('uploadings', UploadingSchema)
const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const UserSchema = new Schema({

    username:{
        type:String,
        required:true
        
    },
    
     
    photo:{
        type:String
    },
      
    password:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    email:{
        type:String,

    },
   
})


module.exports = User = mongoose.model('users', UserSchema)
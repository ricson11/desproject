const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
       
        name:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true
        },
        username:{
            type:String,
            require:true,
           
        },
            
        
})

module.exports = Contact = mongoose.model('contacts', ContactSchema);
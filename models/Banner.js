const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    photo:[{
        type:String,
        
    }],
    
    urlBan:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = Banner=mongoose.model('banners', BannerSchema);
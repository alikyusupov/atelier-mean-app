const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({

	title: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    newPrice:{
        type:Number,
        required:false
    },
    description:{
        type:String,
        required:true
    },
    sizes:{
        type:[String],
        required:true
    },
    tags:{
        type:[String],
        required:true
    },
    
})

module.exports = mongoose.model("Product", ItemSchema);
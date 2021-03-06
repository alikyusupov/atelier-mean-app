const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({

	content: {
        type: String,
        required: true
    },
    sender:{
        type: String,
     required:true
    },
    sendername:{
      type:String,
      required:true
    }
})

module.exports = mongoose.model("Message", messageSchema);
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room:String,
    receiver:String,
    sender:String,
    messages:[{
        sender:String,
        receiver:String,
        message:String
    }]

},{timestamps:true})

module.exports = mongoose.model("Messages",messageSchema);
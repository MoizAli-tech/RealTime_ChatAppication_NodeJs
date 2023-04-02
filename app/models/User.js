const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,default:"customer"}
},{timestamps:true})

module.exports =  mongoose.model("user",userSchema);
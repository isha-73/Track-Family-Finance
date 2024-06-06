
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({

    name : { type : String , required: true},
    email : {type : String , required : true},
    password : {type : String , required : true},
    position : {type : String , required : true},
    family_id : {type : String , required : true}, //unique family id 
    family_name : {type : String , required : true},
});

const User = mongoose.model('user', userSchema);

module.exports =  User ;
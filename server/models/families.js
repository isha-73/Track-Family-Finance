const mongoose = require('mongoose')

const spend_schema = new mongoose.Schema({

spend_on : { type : String , required: true},
amount : { type : String , required: true},
discription : { type : String },
balance_at_each : { type : Number , required: true}

});

const member_schema = new mongoose.Schema({

    name : { type : String , required: true },
    role : { type : String },
    spendings : [spend_schema],

});
const family_schema = new mongoose.Schema({

    name : { type : String , required: true},
    fam_id : { type : String , required: true},
    total_balance : { type : Number , required: true},
    tot_members : { type : Number},
    tot_expenditure : { type : Number},
    tot_savings : { type : Number},
    family_members : [member_schema],

});

const Family = mongoose.model('family',family_schema)
module.exports = Family
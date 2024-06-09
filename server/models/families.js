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
const income_schema = new mongoose.Schema({
    type : {type : String, required : true},
    amount: {type: Number, required : true}
})
const family_schema = new mongoose.Schema({

    name : { type : String , required: true},
    family_code : { type : String , required: true}, // will change after certain interval
    total_balance : { type : Number },
    income_types :[income_schema],
    tot_members : { type : Number},
    tot_expenditure : { type : Number},
    tot_savings : { type : Number},
    family_members : [member_schema],

});

const Family = mongoose.model('family',family_schema)
module.exports = Family
const mongoose = require('mongoose')

const spend_schema = new mongoose.Schema({

type : { type : String , required: true},
amount : { type : Number , required: true},
discription : { type : String },
// balance_at_each : { type : Number , required: true}
});

const pm_schema = new mongoose.Schema({
    type : {type : String, required: true},
    amount : {type : Number, required: true},
    description : {type : String},
    date : {type : Date}
})

const member_schema = new mongoose.Schema({

    name : { type : String , required: true },
    spendings : [spend_schema],
    balance : {type: Number , required: true, default: 0},
    pocket_money : [pm_schema]

});

const income_schema = new mongoose.Schema({
    type : {type : String, required : true},
    amount: {type: Number, required : true},
    date: {type: Date, required : true}
})

const family_schema = new mongoose.Schema({

    name : { type : String , required: true},
    family_code : { type : String , required: true}, // will change after certain interval
    total_balance : { type : Number , default: 0},
    income_types :[income_schema],
    tot_members : { type : Number},
    tot_expenditure : { type : Number, default: 0},
    tot_savings : { type : Number, default: 0},
    family_members : [member_schema],

});

const Family = mongoose.model('family',family_schema)
module.exports = Family
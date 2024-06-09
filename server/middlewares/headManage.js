const express = require('express');
const router = express.Router();
const isAuthorised = require('./authorise')
const Family = require('../models/families')
const cron = require('node-cron');
const scheduleRegularIncome = require('../helping/regular_interval')


// default/select date/month/year on calendar

//inbuilt calculator

// router to add income into balance, option to set regularity if required for regular payments (salary,Investment, ... )

// router.post('/income',async(req, res)=>{

router.post('/income',isAuthorised,async(req, res)=>{

    // code to set regularity of this type of income 
   /* regulairty will be kind of weekly, monthly, yearly, quarterly
    the given amount will be added automatically after selected period of times 
    regular field contains period (weekly, monthly, yearly, quarterly)

    code to upadate balance and add regular inocome type data into income_types */

    const {type, amount, regular} = req.body;
    if(!type || !amount){
        return res.status(400).send("Income type and amount both required!");
    }
    try{
        const family = await Family.findById(req.session.user.family_id);
        family.total_balance+= amount;
        // date of adding income
        family.income_types.push({
            type,
            amount,
            date: new Date() // Record the date when income is added
        })

        // Handle regular payments
        if (regular) {
            try {
                scheduleRegularIncome(family._id, type, amount, regular);
            } catch (error) {
                return res.status(400).send(error.message);
            }
        }

        await family.save();
        res.status(200).send("Income added successfully!");


    }catch(error){

    }
});
// router to add expenses,option to set regularity if required

// add pocket money for members

// router to enable/disable visibility of some kind of info to members





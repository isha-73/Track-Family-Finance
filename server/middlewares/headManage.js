const express = require('express');
const router = express.Router();
const isAuthorised = require('./authorise')
const Family = require('../models/families')
const cron = require('node-cron');
const { scheduleRegularIncome } = require('../helping/regular_interval')
const { scheduleRegularExpense } = require('../helping/regular_interval')

// default/select date/month/year on calendar & inbuilt calculator

// router to add income into balance, option to set regularity if required for regular payments (salary,Investment, ... )

// router.post('/income',async(req, res)=>{

router.post('/income', isAuthorised, async (req, res) => {

  // code to set regularity of this type of income 
  /* regulairty will be kind of weekly, monthly, yearly, quarterly
   the given amount will be added automatically after selected period of times 
   regular field contains period (weekly, monthly, yearly, quarterly)

   code to upadate balance and add regular inocome type data into income_types */

  const { type, amount, regular, date } = req.body;
  if (!type || !amount) {
    return res.status(400).send("Income type and amount both required!");
  }

  try {
    const updatedFamily = await Family.findByIdAndUpdate(
      req.session.user.family_id,
      {
        $inc: { total_balance: amount }, // Increment total balance
        $push: {
          income_types: {
            type,
            amount,
            date: new Date(), // Record the date when income is added
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedFamily) {
      return res.status(400).send('Family not found');
    }

    console.log("Family object after modification:", updatedFamily);

    // Handle regular payments (optional)
    if (regular) {
      try {
        scheduleRegularIncome(updatedFamily._id, type, amount, regular);
      } catch (error) {
        return res.status(400).send(error.message);
      }
      console.log(`Scheduled regular income of ${amount} for family  every ${regular}`);
    }

    res.status(200).send("Income added successfully!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// router to add expenses,option to set regularity if required
router.post('/expense', isAuthorised, async (req, res) => {

  const { spend_on, type, amount, regular, date, description } = req.body;

  // Check if required fields are provided
  if (!spend_on || !amount) {
    return res.status(400).send("Expense type and amount both required!");
  }

  try {
    // First, find the family to get the member index
    const family = await Family.findById(req.session.user.family_id);

    if (!family) {
      return res.status(400).send('Family not found');
    }

    // Identify the family member you want to add the expenditure to
    const memberIndex = family.family_members.findIndex(member => member.name === spend_on);

    if (memberIndex === -1) {
      return res.status(400).send('Family member not found');
    }

    // Add the expenditure to the spendings array of the identified family member

    const updates = {
      $push: {
        [`family_members.${memberIndex}.spendings`]: {
          type,
          amount,
          description,
          date: date || new Date()
        }
      },
      $inc: { 
        tot_expenditure: amount,
        total_balance: -amount // Decrement total balance by amount
      }
    };

    // Perform the combined update
    const updatedFamily = await Family.findByIdAndUpdate(
      req.session.user.family_id,
      updates,
      { new: true } // Return the updated document
    );


    // Handle regular expenses (optional)
    if (regular) {
      try {
        scheduleRegularExpense(updatedFamily._id, type, spend_on, amount, regular);
      } catch (error) {
        return res.status(400).send(error.message);
      }
      console.log(`Scheduled regular expense of ${amount} for family  every ${regular}`);
    }

    res.status(200).send("Expense added successfully!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// add pocket money for members
router.post('/pocketmoney', isAuthorised, async (req, res) => {
  const { spend_on, type, amount, date, description } = req.body;

  // Check if required fields are provided
  if (!spend_on || !amount) {
    return res.status(400).send("SpendOn and amount both required!");
  }

  try {
    // Find the family to get the member index
    const family = await Family.findById(req.session.user.family_id);

    if (!family) {
      return res.status(400).send('Family not found');
    }

    // Identify the family member you want to add the expenditure to
    const memberIndex = family.family_members.findIndex(member => member.name === spend_on);

    if (memberIndex === -1) {
      return res.status(400).send('Member not found');
    }

    // Add the expenditure to the pocket_money array of the identified family member
    const updates = {
      $push: {
        [`family_members.${memberIndex}.pocket_money`]: {
          type,
          amount,
          description,
          date: date || new Date()
        }
      },
      $inc: {
        [`family_members.${memberIndex}.balance`]: amount,
        tot_expenditure: amount,
        total_balance: -amount // Decrement total balance by amount
      }
    };

    // Perform the combined update
    const updatedFamily = await Family.findByIdAndUpdate(
      req.session.user.family_id,
      updates,
      { new: true } // Return the updated document
    );

    return res.status(200).send("Pocket Money Added Successfully!!!");
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send(error.message);
  }
});

// router to enable/disable visibility of some kind of info to members

module.exports = router 

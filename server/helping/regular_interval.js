const cron = require('node-cron');
const Family = require('../models/families'); // Adjust the path as necessary

function scheduleRegularIncome(familyId, type, amount, interval) {
    // Convert interval to cron format
    const cronExpression = getCronExpression(interval);
    if (!cronExpression) {
        throw new Error("Invalid interval. Must be 'weekly', 'monthly', 'yearly', or 'quarterly'.");
    }

    // Schedule the job
    cron.schedule(cronExpression, async () => {
        try {
            const updatedFamily = await Family.findByIdAndUpdate(
                familyId,
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
                console.log(`Added regular income of ${amount} to family ${familyId}`);
            }
        
     catch (error) {
            console.error(`Error adding regular income for family ${familyId}: `, error);
        }
    });

    // console.log(`Scheduled regular income of ${amount} for family ${familyId} every ${interval}`);
}

function scheduleRegularExpense(familyId, type, spend_on, amount, interval){
     // Convert interval to cron format
     const cronExpression = getCronExpression(interval);
     if (!cronExpression) {
         throw new Error("Invalid interval. Must be 'weekly', 'monthly', 'yearly', or 'quarterly'.");
     }

      // Schedule the job
    cron.schedule(cronExpression, async () => {
        try {
            const family = await Family.findById(familyId);
        
            // Identify the family member you want to add the expenditure to
            const memberIndex = family.family_members.findIndex(member => member.name === spend_on);
        
            if (memberIndex === -1) {
              return res.status(400).send('Family member not found');
            }
        
            // Add the expenditure to the spendings array of the identified family member
            const spendingUpdate = {
              $push: {
                [`family_members.${memberIndex}.spendings`]: {
                  type,
                  amount,
                  date: new Date()
                }
              }
            };
            // Update the family member's spendings
            await Family.updateOne(
              { _id: familyId },
              spendingUpdate
            );
            // Then, update the total balance and total expenditure
            const updatedFamily = await Family.findByIdAndUpdate(
              familyId,
              {
                $inc: { total_expenditure: amount },
                $dec: { total_balance: amount }
              },
              { new: true } // Return the updated document
            );
                console.log(`Added regular income of ${amount} to family ${familyId}`);
            }
        
     catch (error) {
            console.error(`Error adding regular income for family ${familyId}: `, error);
        }
    });
}

function getCronExpression(interval) {
    switch (interval.toLowerCase()) {
        case 'daily':
            return '0 0 * * *'; // Every day at midnight
        case 'weekly':
            return '0 0 * * 0'; // Every Sunday at midnight
        case 'monthly':
            return '0 0 1 * *'; // On the first day of every month at midnight
        case 'yearly':
            return '0 0 1 1 *'; // On January 1st every year at midnight
        case 'quarterly':
            return '0 0 1 */3 *'; // On the first day of every 3rd month at midnight
        default:
            return null;
    }
}
module.exports = {scheduleRegularIncome, scheduleRegularExpense};

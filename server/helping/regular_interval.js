const cron = require('node-cron');
const Family = require('../models/Family'); // Adjust the path as necessary

function scheduleRegularIncome(familyId, type, amount, interval) {
    // Convert interval to cron format
    const cronExpression = getCronExpression(interval);
    if (!cronExpression) {
        throw new Error("Invalid interval. Must be 'weekly', 'monthly', 'yearly', or 'quarterly'.");
    }

    // Schedule the job
    cron.schedule(cronExpression, async () => {
        try {
            const family = await Family.findById(familyId);
            if (family) {
                family.total_balance += amount;
                family.income_types.push({
                    type,
                    amount,
                    date: new Date()
                });
                await family.save();
                console.log(`Added regular income of ${amount} to family ${familyId}`);
            } else {
                console.error(`Family with ID ${familyId} not found`);
            }
        } catch (error) {
            console.error(`Error adding regular income for family ${familyId}: `, error);
        }
    });

    console.log(`Scheduled regular income of ${amount} for family ${familyId} every ${interval}`);
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

module.exports = scheduleRegularIncome;

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose')
const uri = process.env.URL;

const connectDB = async () => {
    // console.log(uri);
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri);
        console.log('MongoDB is Connected...');
    } catch (err) {
        console.error(err.message + "");
        process.exit(1);
    }
};
// connectDB()
module.exports= connectDB
const express = require('express');
const connectDB = require('./dbserver')
const User = require ('./models/users')
connectDB()

// Create an Express application
const app = express();




// To Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

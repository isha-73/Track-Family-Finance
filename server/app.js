const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./dbserver')
const registration = require ('./middlewares/registration')
const login = require('./middlewares/login')

connectDB()

// Create an Express application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/register',registration )
app.use('/user',login)

// To Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

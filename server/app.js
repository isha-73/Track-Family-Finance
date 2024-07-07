const express = require('express');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./dbserver')
const registration = require ('./middlewares/registration')
const login = require('./middlewares/login')
const head = require('./middlewares/headManage')

connectDB()

// Create an Express application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/register',registration )
app.use('/user',login)
app.use('/headdashboard',head)

// To Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

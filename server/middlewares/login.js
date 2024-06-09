const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const session = require('express-session');

require('dotenv').config({ path: '.env.local' });

router.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send('Invalid email or password.');
        }

        // Create a session for the user
        req.session.user = { id: user._id, email: user.email, family_id: user.family_id, position : user.position };

        // Optionally set a cookie with a custom expiration time (e.g., 1 day)
        req.session.cookie.expires = new Date(Date.now() + 86400 * 1000); // 1 day

        // Return a success response
        res.status(200).send('Login successful.');

    } catch (error) {
        res.status(500).send(`Server error.${error}`);
    }
});

module.exports = router;

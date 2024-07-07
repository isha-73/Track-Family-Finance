const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Family = require('../models/families');
const uniqueId = require('../middlewares/codeGenerate');
const bcrypt = require('bcrypt');


require('dotenv').config({ path: '.env.local' });


router.post('/createfamily', async (req, res) => {
    const { name, email, password, family_name } = req.body;

    if (!name || !email || !password || !family_name) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already in use.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        var family_id = ""
        const family_code = uniqueId
        const newFamily = new Family({
            name: family_name,
            family_code, // to be generated randomly
            tot_members: 1,
            total_balance: 0,
            tot_expenditure: 0,
            tot_savings: 0,
            family_members: [{
                name,
                position: "HEAD",

            }]
        })
        await newFamily.save()
            .then((doc) => {
                console.log('New family created with _id:', doc._id);
                family_id = doc._id;
            })


        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            position: "HEAD",
            family_id,
            family_name
        });

        await newUser.save();

        req.session.user = { id: newUser._id, email: newUser.email, family_id: family_id };

        res.status(201).send('New Family Create Successfully');
    } catch (error) {
        res.status(500).send(`Server error.${error}`);
    }
});


// router to join existing family
router.post('/joinfamily', async (req, res) => {
    const { name, email, password, family_code } = req.body;
    if (!name || !email || !password || !family_code) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already in use.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const its_family = await Family.findOne({ family_code: family_code });

        if (!its_family) {
            return res.status(400).send('Invalid Family Code!');
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            position: "MEMBER",
            family_name: its_family.name,
            family_id: its_family._id
        });

        // Increment tot_members by 1
        its_family.tot_members += 1;
        its_family.family_members.push({
            name,
            position: "MEMBER"
        });

        // Save the updated family document
        await its_family.save();

        // Save the new user
        await newUser.save();

        req.session.user = { id: newUser._id, email: newUser.email, family_id: its_family._id };

        // Return a success response
        res.status(201).send('New member added successfully.');

    } catch (error) {
        res.status(500).send(`Server error.${error}`);
    }

});

module.exports = router;
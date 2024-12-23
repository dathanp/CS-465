const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');

// Register a new user
const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        console.error('Missing required fields during registration.');
        return res.status(400).json({ message: "All fields required" });
    }

    console.log('Registering user:', req.body);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || 'user',
    });

    user.setPassword(req.body.password);

    try {
        await user.save();
        const token = user.generateJwt();
        console.log('User registered successfully:', user);
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(400).json(err);
    }
};

// Login an existing user
const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res
                .status(404)
                .json(err);
        }
        if (user) {
            const token = user.generateJwt();
            res
                .status(200)
                .json({ token });
        } else {
            res
                .status(401)
                .json(info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};

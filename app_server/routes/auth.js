const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const apiEndpoint = 'http://localhost:3000/api'; // API base URL

// Show the login page
router.get('/login', (req, res) => {
    const error = req.query.error ? true : false;
    res.render('login', { title: 'Login', error });
});

// Handle login form submission
router.post('/login', async (req, res) => {
    try {
        const response = await fetch(`${apiEndpoint}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const result = await response.json();

        if (response.ok) {
            // Set the token in cookies
            res.cookie('token', result.token, { httpOnly: true });

            // Log success message in the console
            console.log('Login successful for user:', req.body.email);

            // Redirect to the homepage
            return res.redirect('/');
        }

        // Log failure message in the console
        console.error('Login failed for user:', req.body.email);

        // Redirect back to login with a query parameter for error
        return res.redirect('/auth/login?error=1');
    } catch (error) {
        console.error('Error during login:', error.message);

        // Redirect back to login in case of an error
        res.redirect('/auth/login?error=1');
    }
});


// Show the registration page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Handle logout
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT cookie
    res.redirect('/'); // Redirect to homepage or login page
});

// Handle registration form submission
router.post('/register', async (req, res) => {
    try {
        const response = await fetch(`${apiEndpoint}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const result = await response.json();

        if (response.ok) {
            return res.redirect('/auth/login'); // Redirect to login page on success
        }

        res.render('register', { title: 'Register', message: result.message || 'Registration failed' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.render('register', { title: 'Register', message: 'An error occurred while registering.' });
    }
});

module.exports = router;

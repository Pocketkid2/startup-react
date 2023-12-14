var express = require('express');
var data = require('./data');
var auth_router = express.Router();

auth_router.use((req, res, next) => {
    console.log(`\nAuth Request (time = ${new Date(Date.now()).toLocaleString()})`)
    next();
});

auth_router.post('/signup', async (req, res) => {
    
    // Make sure the important fields are in the signup request
    if (!req.body.username) {
        console.log("\tRejecting request due to missing username");
        res.status(400).send("Missing username");
        return;
    }
    if (!req.body.password) {
        console.log("\tRejecting request due to missing password");
        res.status(400).send("Missing password");
        return;
    }

    // Make sure the username is unique
    const username_exists = await data.user_exists(req.body.username);
    if (username_exists) {
        console.log("\tRejecting request due to existing username");
        res.status(409).send("Username already exists");
        return;
    }

    await data.add_user(req.body.username, req.body.password);

    console.log("\tUser signed up, attempting authentication");

    // Attempt authentication and return the result
    const auth_token = await data.authenticate_credentials(req.body.username, req.body.password);
    if (auth_token) {
        console.log("\tUser logged in");
        res.cookie('auth_token', auth_token, { sameSite: 'strict' });
        res.status(200).end();
    } else {
        console.log("\tRejecting request due to invalid username/password");
        res.status(401).send("Invalid username/password");
    }
});

auth_router.post('/login', async (req, res) => {

    // If we get an empty login request but we have a valid auth token cookie, return success
    if (req.cookies.auth_token != undefined) {
        const username = await data.authenticate_token(req.cookies.auth_token);
        if (username) {
            console.log("\tUser already logged in");
            res.status(200).end();
            return;
        } else {
            res.cookie('auth_token', '');
        }
    }

    // If we don't receive a cookie, login the usual way
    if (!req.body.username) {
        console.log("\tRejecting request due to missing username");
        res.status(400).send("Missing username");
        return;
    }
    if (!req.body.password) {
        console.log("\tRejecting request due to missing password");
        res.status(400).send("Missing password");
        return;
    }

    // Attempt authentication and return the result
    const auth_token = await data.authenticate_credentials(req.body.username, req.body.password);
    if (auth_token) {
        console.log("\tUser logged in");
        res.cookie('auth_token', auth_token, { sameSite: 'strict' });
        res.status(200).end();
    } else {
        console.log("\tRejecting request due to invalid username/password");
        res.status(401).send("Invalid username/password");
    }
});

auth_router.delete('/logout', async (req, res) => {
    const auth_token = req.cookies.auth_token;
    if (auth_token === undefined) {
        console.log("\tRejecting request due to missing auth token");
        res.status(401).send("Missing auth token");
        return;
    }

    const username = await data.authenticate_token(auth_token);

    if (username === null) {
        console.log("\tRejecting request due to invalid auth token");
        res.status(401).send("Invalid auth token");
        return;
    }

    data.delete_token(username);
    console.log("\tUser logged out");
    res.clearCookie('auth_token');
    res.status(200).end();
});

module.exports = auth_router;
var express = require('express');
var data = require('./data');
var api_router = express.Router();

api_router.use((req, res, next) => {
    console.log(`\nAPI Request (time = ${new Date(Date.now()).toLocaleString()})`)
    next();
});

api_router.get('/list/:list(watchlist|favorites)', async (req, res) => {

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

    const list = await data.get_list(username, req.params.list);

    console.log(`\tSending ${req.params.list} for ${username} as ${JSON.stringify(list)}`);
    res.status(200).send(list);
});

api_router.post('/exists/:list(watchlist|favorites)', async (req, res) => {

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

    const film = req.body.film;

    if (film === undefined) {
        console.log("\tRejecting request due to missing film");
        res.status(400).send("Missing film");
        return;
    }

    const film_exists = await data.film_exists(username, req.params.list, film);

    if (film_exists) {
        console.log(`\tFilm ${film} exists in ${req.params.list} for ${username}`);
        res.status(200).end();
    } else {
        console.log(`\tFilm ${film} does not exist in ${req.params.list} for ${username}`);
        res.status(404).end();
    }
});

api_router.post('/add/:list(watchlist|favorites)', async (req, res) => {

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

    const film = req.body.film;

    if (film === undefined) {
        console.log("\tRejecting request due to missing film");
        res.status(400).send("Missing film");
        return;
    }

    const film_exists = await data.film_exists(username, req.params.list, film);

    if (film_exists) {
        console.log(`\tFilm ${film} already exists in ${req.params.list} for ${username}`);
        res.status(409).send("Film already exists");
        return;
    }

    await data.add_film(username, req.params.list, film);
    console.log(`\tAdded film ${film} to ${req.params.list} for ${username}`);
    res.status(200).end();
});

api_router.delete('/remove/:list(watchlist|favorites)', async (req, res) => {

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

    const film = req.body.film;

    if (film === undefined) {
        console.log("\tRejecting request due to missing film");
        res.status(400).send("Missing film");
        return;
    }

    const film_exists = await data.film_exists(username, req.params.list, film);

    if (!film_exists) {
        console.log(`\tFilm ${film} does not exist in ${req.params.list} for ${username}`);
        res.status(404).send("Film does not exist");
        return;
    }

    await data.remove_film(username, req.params.list, film);
    console.log(`\tRemoved film ${film} from ${req.params.list} for ${username}`);
    res.status(200).end();
});

api_router.get('/user', async (req, res) => {
    
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

    const user_info = await data.get_info(username);

    if (user_info === null) {
        console.log(`\tUser ${username} does not exist`);
        res.status(404).send("User does not exist");
        return;
    }

    console.log(`\tSending user info for ${username} as ${JSON.stringify(user_info)}`);
    res.status(200).send(JSON.stringify(user_info));
});

module.exports = api_router;
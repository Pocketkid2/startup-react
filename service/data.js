const { MongoClient } = require("mongodb");
const config = require("./db_config.json");

const bcrypt = require('bcrypt');
const uuid = require('uuid');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('filmhub');
const user_collection = db.collection('user');
const auth_collection = db.collection('auth');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("Connected successfully to database");
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

module.exports = {
    authenticate_credentials: authenticate_credentials,
    authenticate_token: authenticate_token,
    user_exists: user_exists,
    add_user: add_user,
    get_info: get_info,
    get_list: get_list,
    film_exists: film_exists,
    add_film: add_film,
    remove_film: remove_film,
    delete_token: delete_token,
    list_users: list_users,     // DEBUG
    list_tokens: list_tokens,   // DEBUG
};

function list_users() {
    user_collection.find().toArray().then(users => {
        console.log(JSON.stringify(users));
    });
}

function list_tokens() {
    auth_collection.find().toArray().then(tokens => {
        console.log(JSON.stringify(tokens));
    });
}

async function get_info(username) {
    const user = await user_collection.findOne({ username: username });
    if (user) {
        const { password, ...user_copy } = user;
        return user_copy;
    }
    return null;
}

async function get_list(username, list_name) {
    const user = await user_collection.findOne({ username: username });
    if (user && user[list_name]) {
        return user[list_name];
    }
    return null;
}

async function film_exists(username, list_name, film_name) {
    const user = await user_collection.findOne({ username: username });
    if (user && user[list_name]) {
        return user[list_name].includes(film_name);
    }
    return false;
}

async function add_film(username, list_name, film_name) {
    let user = await user_collection.findOne({ username: username });
    if (user) {
        if (user[list_name] === undefined) {
            user[list_name] = [];
        }
        user[list_name].push(film_name);
        await user_collection.updateOne({ username: username }, { $set: user });
        console.log(`Added film ${film_name} to list ${list_name} for user ${username}`);
    }
}

async function remove_film(username, list_name, film_name) {
    let user = await user_collection.findOne({ username: username });
    if (user) {
        if (user[list_name] === undefined) {
            user[list_name] = [];
        }
        user[list_name] = user[list_name].filter(film => film !== film_name);
        await user_collection.updateOne({ username: username }, { $set: user });
        console.log(`Removed film ${film_name} from list ${list_name} for user ${username}`);
    }
}

async function user_exists(username) {
    const user = await user_collection.findOne({ username: username });
    if (user) {
        console.log("Found user " + JSON.stringify(user));
        return true;
    }
    return false;
}

async function add_user(user_object) {
    bcrypt.hash(user_object.password, 10, async function(err, hash) {
        user_object.password = hash;
        await user_collection.insertOne(user_object);
        console.log(`Added user ${user_object.username}`);
    });
}

// Attempts to authenticate with the given credentials.
//  If successful, returns an auth token.
//  If unsuccessful, returns null.
async function authenticate_credentials(username, password) {
    const user = await user_collection.findOne({ username: username });
    if (user) {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const auth = await auth_collection.findOne({ username: username });
            if (auth) {
                console.log(`Returning existing authtoken ${auth.token}`);
                return auth.token;
            } else {
                const token = create_token(username);
                console.log(`Created new authtoken ${token}`);
                return token;
            }
        } else {
            console.log(`Rejecting request due to incorrect password for user ${username}`);
            return null;
        }
    } else {
        console.log(`Rejecting request due to non-existent username ${username}`);
        return null;
    }
}

// Attempts to authenticate with the given auth token.
//  If successful, returns the username.
//  If unsuccessful, returns null.
async function authenticate_token(token) {
    const auth = await auth_collection.findOne({ token: token });
    if (auth) {
        return auth.username;
    }
    return null;
}

function delete_token(username) {
    auth_collection.deleteOne({ username: username });
}

function create_token(username) {
    var token = uuid.v4();
    
    auth_collection.insertOne({ username: username, token: token });

    return token;
}
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const spotify = require('spotify-web-api-node');

const routes = express();

var scopes = ['user-read-private', 'user-read-email'],
  redirectUri = 'https://google.com/',
  clientId = "a40da5695734475a8d4485f862c7faa3",
  state = 'Tennessee';

const spotifyAPI = new spotify( {
    clientId: "a40da5695734475a8d4485f862c7faa3",
    clientSecret: "d0361cf15ae44f25b570038110facf37",
    redirectUri: redirectUri
});

//ps://accounts.spotify.com/authorize?client_id=a40da5695734475a8d4485f862c7faa3
const authorizeURL = spotifyAPI.createAuthorizeURL(scopes, state);
console.log(authorizeURL);

const options = {
    root: __dirname + '/public'
}

//for handling JSON POST data
routes.use(bodyParser.json());

routes.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

routes.get('/authCallback', (req, res) => {
    console.log(req.url);
});

routes.get('/getSong', (req, res) => {
    let query = req.body;
    spotifyAPI.searchTracks(query)
        .then( (data) => {
            res.status(200);
            let song = {};
            song.artist = data["artists"][0]["name"];
            song.name = data["name"];
            song.filePath = data["images"][0]["url"];
            res.json(song);
        })
        .catch( (err) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(`Unable to search for track, error: ${err}`);
            }
        });
});

//receives queue as JSON data and writes it to file
routes.post('/storeQueue', (req, res) => {
    console.log("storeQueue request made!")
    console.log(req.body); //should be JSON
    fs.writeFile('database.json', JSON.stringify(req.body), (err) => {
        if (err) res.status(500).send(`Unable to write to database: ${err.message}`);
        else res.status(200).send("Successfully wrote to database!");
    });
});

//reads queue from file and POSTs it as JSON data
routes.get('/getQueue', (req, res) => {
    console.log("/getQueue request made!");
    fs.readFile('database.json', 'utf8', (err, data) => {
        if (err) res.status(500).send(`Unable to read from database: ${err.message}`);
        else {
            let parsedData = JSON.stringify(JSON.parse(data));
            console.log(parsedData);
            res.status(200);
            res.contentType = 'application/json';
            res.send(parsedData);
        }
    });
});


module.exports = routes;
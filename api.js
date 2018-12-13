const fs = require('fs');
const spotify = require('spotify-web-api-node');

let kwayAPI = {
    scopes: ['user-read-private', 'user-read-email'],
    redirectUri: 'https://kway-app.herokuapp.com/authCallback',
    clientId: "a40da5695734475a8d4485f862c7faa3",
    state: 'Tennessee',
    spotifyAPI: new spotify( {
        clientId: "a40da5695734475a8d4485f862c7faa3",
        clientSecret: "d0361cf15ae44f25b570038110facf37",
        redirectUri: this.redirectUri
    }),

    //uses Spotify Node API to search Spotify for @param query
    searchTracks: function(query) {
        var promise = new Promise((resolve, reject) => {
            this.spotifyAPI.searchTracks(query)
                .then( (data) => {

                    let songs = [];
                    data.body.tracks.items.forEach((track) => {
                        let song = {};
                        song.artist = track.artists[0].name;
                        song.name = track.name;
                        song.filePath = track.album.images[0].url;
                        songs.push(song);
                    });

                    resolve(songs);
                })
                .catch( (err) => {
                    reject(`Unable to search: ${err.message}`);
                });
        });
        return promise;
    },

    //writes @param queue as a JSON object to our database (text file lol)
    writeQueue: function(queue) {
        var promise = new Promise((resolve, reject) => {
            fs.writeFile('database.json', JSON.stringify(queue), (err) => {
                if (err) reject(`Unable to write to database: ${err.message}`);
                else resolve("Successfully wrote to database!");
            });
        }); 
        return promise;
    },

    //reads queue from database and returns it as JSON object
    readQueue: function() {
        var promise = new Promise((resolve, reject) => {
            fs.readFile('database.json', 'utf8', (err, data) => {
                if (err) reject(`Unable to read from database: ${err.message}`);
                else {
                    // let parsedData = JSON.stringify(JSON.parse(data));
                    resolve(data);
                }
            });
        });
        return promise;
    }
}

kwayAPI.spotifyAPI.clientCredentialsGrant()
    .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        kwayAPI.spotifyAPI.setAccessToken(data.body['access_token']);
    })
    .catch( (err) => {
        console.log(`error: ${err}`);
    });

module.exports = kwayAPI
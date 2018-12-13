const express = require('express');
const bodyParser = require('body-parser');
const kwayAPI = require('./api.js');

const routes = express();

//for handling JSON data in routes
routes.use(bodyParser.json());

routes.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

routes.get('/authCallback', (req, res) => {
    res.send(req.url);
});

routes.get('/getSong/:name', (req, res) => {
    let query = req.params.name;
    console.log(`\n/getSong/${req.params.name} requested!`);
    
    kwayAPI.searchTracks(query)
        .then( (data) => {
            res.status(200).json(data);
        })
        .catch( (reason) => {
            console.log(reason);
            res.status(500).send(reason);
        });
});

//receives queue as JSON data and gives it to API to be written to database
routes.post('/storeQueue', (req, res) => {
    console.log('\n/storeQueue request made!');
    
    kwayAPI.writeQueue(req.body)
        .then( (success) => {
            console.log('store succeeded');
            res.status(200).send(success);
        })
        .catch( (failure) => {
            console.log('store failed');
            res.status(500).send(failure);
        });
});

//reads queue from file and POSTs it as JSON data
routes.get('/getQueue', (req, res) => {
    console.log('\n/getQueue request made!');
    
    kwayAPI.readQueue()
        .then( (data) => {
            console.log(`queue read: ${data}`);
            res.status(200).send(data);
        })
        .catch( (failure) => {
            console.log('read failed');
            res.status(500).send(failure)
        });
});


module.exports = routes;
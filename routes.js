const express = require('express');
const routes = express();

const options = {
    root: __dirname + '/public'
}

routes.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

module.exports = routes;
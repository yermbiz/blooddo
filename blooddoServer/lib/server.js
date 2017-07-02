'use strict';

// Babel ES6/JSX Compiler
require('babel-register');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const api = require('./routes/api');
const config = require('./config');

mongoose.connect(config.database);
mongoose.connection.on('error', () => {
  console.error('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

process.on('SIGINT', () => {
  mongoose.connection.close( () => {
    console.warn('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose default connection disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('connected', () => {
  console.info('Mongoose default connection open', {db:config.database});
});

const app = express();
app.set('port', process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const staticPath = path.join(__dirname, config.client_path);
app.use(express.static(staticPath));

app.use('/api', api);
// Catch all other routes and return the index file
app.get(['/', '/donor/:link'], (req, res) => {
  res.sendFile(path.join(staticPath,'index.html'));
});

const server = require('http').createServer(app);
// /**
//  * Socket.io stuff.
//  */
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  process.on('data-changed', () => {
    io.emit('data-chaged', {type:'new-message', text: 'message'});
  });

});

server.listen(app.get('port'), () => {
  console.info('Express server listening ', {port: app.get('port')});
});

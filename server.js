const express = require('express');
const stylus = require('stylus');
const nib = require('nib');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.render('index.ejs');
});

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

// tell node to compile.styl-files to normal css-files
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}))

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', socket => {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '<p id="user-stat">' + socket.username + ' joined the hang 😎</p>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '<p id="user-stat">' + socket.username + ' left the hang 😢</p>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

    socket.join('some room');
    io.to('some room').emit('some event');


});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});

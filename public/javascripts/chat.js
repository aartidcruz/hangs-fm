
var socket = io.connect('http://localhost:8080');

// submit text message without reload/refresh the page
$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat_message', $('#message-input').val());
    $('#message-input').val('');
    return false;
});

$("#message-input").keypress(function (e) {
    if(e.which == 13 && !e.shiftKey) {
        $(this).closest("form").submit();
        e.preventDefault();
    }
});


// append the chat text message
socket.on('chat_message', function(msg){
    $('#messages').append($('<li>').html(msg));
});

// append text if someone is online
socket.on('is_online', function(username) {
    $('#messages').append($('<li>').html(username));
});

$( document ).ready(function() {
    console.log( "ready!" );
    // ask username
    var username = prompt('What is your name?');
    socket.emit('username', username);
});

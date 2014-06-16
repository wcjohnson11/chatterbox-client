// YOUR CODE HERE:
// var message = {
// //   username: results.username,
// //   text: results.text,
// //   roomname: results.roomname,
// //   createdAt: results.createdAt
// // };


var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function(){

  },
  send: function(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function(message) {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        var results = data.results;
        var message = {};
        for ( var i = 0; i < results.length; i++) {
          app.addMessage(results[i]);
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function(message) {
    var msg = $('<div></div>').addClass('message');
    $('<h3>' + message.username + '</h3>').prependTo(msg);
    $('<p>' + message.text + ' in ' + message.roomname + '</p>').appendTo(msg);
    msg.appendTo('#chats');
  }
};

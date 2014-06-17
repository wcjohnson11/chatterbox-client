// YOUR CODE HERE:
// var message = {
// //   username: results.username,
// //   text: results.text,
// //   roomname: results.roomname,
// //   createdAt: results.createdAt
// // };
//
test = function(str) {
  var a = /([.?*+^$[\]'"\\(){}<>|-])/g;
  return a.test(str);
};

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  rooms: [],
  friends: [],
  init: function(){
    app.fetch();
    $('.username').on('click', function(){
      var username = $(this).text();
      app.addFriend(username);
    });

    $('.submit').on('click', function() {
      var userText = $('.submitText').val();
      app.handleSubmit(userText);
    });

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
          //include typechecking to protect XSS attacks
          if (!test(results[i].text)){
          app.addMessage(results[i]);
          }
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
    var $msg = $('<div></div>').addClass('message');
    $('<h3>' + message.username + '</h3>').addClass('username').prependTo($msg);
    $('<p>' + message.text + ' in ' + message.roomname + '</p>').appendTo($msg);
    $msg.appendTo('#chats');
  },
  addRoom: function(roomName) {
    var $room = $('<div>'+ roomName + '</div>').addClass('room');
    $room.appendTo('#roomSelect');
    app.rooms.push(roomName);
  },
  addFriend: function(user) {
    app.friends.push(user);
  },
  handleSubmit: function(text){
    var submission = {};
    submission.username = //window.location.search  parse this
    submission.text = text;
    submission.roomname = //come up with a way to save and access current roomdif
    app.send(message);
  }
};
app.init();

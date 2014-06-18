// YOUR CODE HERE:
// var message = {
// //   username: results.username,
// //   text: results.text,
// //   roomname: results.roomname,
// //   createdAt: results.createdAt
// // };
//
//
//Additional lines for merge
var xssAttack = function(str) {
  var a = /([.?*+^$[\]'"\\(){}<>|-])/g;
  return a.test(str);
};

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  rooms: [],
  friends: [],
  init: function(){
    $('button').on('click', function() {
      var userText = $('.submitText').val();
      if(userText !== '') {
        app.handleSubmit(userText);
      }
    });

    setInterval(function(){
      app.fetch();}, 1000);

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
  fetch: function(room) {
    var datum =
    $.ajax({
      url: this.server,
      type: 'GET',
      data: '&order=-createdAt',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Messages received');
        var results = data.results;
        app.clearMessages();
        app.rooms = _.filter(_.uniq(_.pluck(results, 'roomname')), function(room){
          if (room !== undefined){
            return room;
          }
        });
        for ( var i = 0; i < results.length; i++) {
          if (!xssAttack(results[i].text)){
            app.addMessage(results[i]);
          }
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      },
      complete: function() {
          app.manageFriend();
          app.renderRooms();
        }
    });
  },
  clearMessages: function() {
    $('#chats').empty();
    $('#roomSelect').empty();
  },
  addMessage: function(message) {
    var $msg = $('<div></div>').addClass('chat').data('username', message.username);
    $('<h3>' + message.username + '</h3>').addClass('username').prependTo($msg);
    $('<p>' + message.text + ' in ' + message.roomname + '</p>').appendTo($msg);
    $msg.appendTo('#chats');
  },
  renderRooms: function() {
   _.each(app.rooms, function(room){
     $('<li>' + room + '</li>').appendTo($('#roomSelect'));
   });
  },
  addRoom: function(roomName) {
    var $room = $('<div>'+ roomName + '</div>').addClass('room');
    $room.appendTo('#roomSelect');
    app.rooms.push(roomName);
  },
 manageFriend: function() {
    $('.username').on('click', function(){
          var user = ($(this).parent().data('username'));
          $(this).parent().addClass('friend');
          app.friends.push(user);
        });
  },
  handleSubmit: function(text){
    //XSS DEFENSE NEEDED
    var submission = {};
    submission.username = window.location.search.slice(10);
    submission.text = text;
    submission.roomname = 'placeholder';
    app.send(submission);
  }
};
$(document).on('ready', function() {
  app.init();
});

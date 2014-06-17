// YOUR CODE HERE:
// var message = {
// //   username: results.username,
// //   text: results.text,
// //   roomname: results.roomname,
// //   createdAt: results.createdAt
// // };
//
var xssAttack = function(str) {
  var a = /([.?*+^$[\]'"\\(){}<>|-])/g;
  return a.test(str);
};

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  rooms: [],
  friends: [],
  init: function(){
    app.fetch();
    $('button').on('click', function() {
      var userText = $('.submitText').val();
      if(userText !== '') {
        app.handleSubmit(userText);
      }
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
  fetch: function() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: '&order=-createdAt',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Messages received');
        var results = data.results;
        app.rooms = _.uniq(_.pluck(results, 'roomname'));
        debugger;
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
        $('.username').on('click', function(){
          var user = ($(this).parent().data('username'));
         app.addFriend(user);
         $(this).parent().addClass('friend');
        });
        //Appending rooms to #roomSelect in li's
        _.each(app.rooms, function(room){
          $('<li>' + room + '</li>').appendTo($('#roomSelect'));
        });
      }
    });
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  addMessage: function(message) {
    var $msg = $('<div></div>').addClass('chat').data('username', message.username);
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

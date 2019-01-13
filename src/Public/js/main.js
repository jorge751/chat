
$(function () {

    // DOM del chat
    const socket = io();
    const $messageForm = $('#message-form')
    const $messageBox = $('#message')
    const $chat = $('#chat')

    // DOM del registro de usuario
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickName = $('#nickName');

    // DOM lista de usuarios
    const $users = $('#usernames');

    $nickForm.submit (e => {
        e.preventDefault();
        if ($nickName.val() == "") {
            $nickError.html('<b>Enter username.</b><br/>');
            return;
        }
        socket.emit('new user', $nickName.val(),  data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $('#nickError').html('<div class="alert alert-danger">That username already exists.</div>');
            };
            $nickName.val('');
        });
    });

    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append('<p class="error"> '+data+' </p>')
        });
        $messageBox.val('');
    });
    
    socket.on('new message', data => {
        $chat.append('<p><b>' + data.timeMsg + ' : '  + data.nick + ' : </b> ' + data.msg + '<br/></p>');
    });

    socket.on('usernames', data =>  {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += '<p> <i class="fas fa-user">' + data[i] + '</p>';
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $chat.append('<p class="whisper"><b>' + data.timeMsg + ' : '  + data.nick + ' : </b> ' + data.msg + '<br/></p>');
    })
});

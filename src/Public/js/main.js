
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
        socket.emit('new user', $nickName.val(),  result => {
            if (result) {
                $('#nickWrap').hide();
                $chat.html('');
                $('#session').html('<h3> Sesión de '+$nickName.val()+'</h3>');
                $('#contentWrap').show();
            } else {
                $('#nickError').html('<div class="alert alert-danger">That username already exists.</div>');
            };
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
        displayMsg(data);
    });

    socket.on('usernames', data =>  {
        let html = '';
        for (let x = 0; x < data.length; x++) {
            html += '<p> <i class="fas fa-user">  ' + data[x] + '</p>';
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $chat.append('<p class="whisper"><b>' + data.timeMsg + ' : '  + data.nick + ' : </b> ' + data.msg + '<br/></p>');
    });

    socket.on('load old msgs', msgs => {
        for (let i = 0; i < msgs.length; i++) {
            displayMsg(msgs[i]);
        }
    });

    function displayMsg(data) {
        $chat.append('<p><b>' + data.timeMsg + ' : '  + data.nick + ' : </b> ' + data.msg + '<br/></p>');
    }
});

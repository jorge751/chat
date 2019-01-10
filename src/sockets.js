
module.exports = function (io) {

    let nickNames = [];

    io.on('connection', socket => {
        console.log('New user connected.');
        socket.on('new user', (data, cb) => {
            if (nickNames.indexOf(data) != -1) {
                cb(false);
            } else {
                cb(true);
                socket.nickName = data;
                nickNames.push(socket.nickName);
                updateNicknames();
            }
        });
        socket.on('send message', data => {
            io.sockets.emit('new message', {
                msg: data,
                nick: socket.nickName
            });
        });
        socket.on('disconnect', data => {
            if (!socket.nickName) return;
            nickNames.splice(nickNames.indexOf(socket.nickName), 1);
            updateNicknames();
        });
        function updateNicknames () {
            io.sockets.emit('usernames', nickNames);
        };
    });
}

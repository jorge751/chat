
const moment = require('moment');
const Db = require('tingodb')().Db;

// Decide si graba o no la DB
const setDB = (process.argv[2] != undefined);
var dbName
if (setDB) {
    const db = new Db('', {});
    dbName = process.argv[2].replace(/_/g,' ');
    var dbColl = dbName + '_messages_'
    dbColl += moment().format('YYYY_MM_DD') + '.jdb'
    var collection = db.collection(dbColl);
};

module.exports = function (io) {

    let users = {};

    io.on('connection', socket => {
        console.log('New user connected.');

        socket.on('titulo', (cb) => {
            if (setDB) { cb(dbName) } { cb('') };
        });

        socket.on('new user', (data, cb) => {
            if (data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickName = data;
                users[socket.nickName] = socket;
                updateNicknames();
            };
            // Carga mensajes anteriores
            if (setDB) {
                collection.find({}).toArray(function(err, msgs) {
                    if (err) throw err;
                    socket.emit('load old msgs', msgs);
                });
            }
        });

        socket.on('send message', (data,cb) => {
            var msg = data.trim();
            if (msg.substr(0,3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index != -1) {
                    var name = msg.substr(0,index)
                    msg = msg.substr(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickName,
                            timeMsg: moment().format('HH:mm')
                        });
                    } else {
                        cb('Error!!! Please enter a valid user.');
                    }
                } else {
                    cb('Error!!! Please enter your message.');
                };
            } else {
                const timeMsg = moment().format('HH:mm');
                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickName,
                    timeMsg
                });
                //  Graba el mensaje
                if (setDB) {
                    collection.insert({
                        timeCreated: moment().format(''),
                        timeMsg,
                        nick: socket.nickName,
                        msg: data}, {w:1}, (err, result) => {});
                };
            };
        });

        socket.on('disconnect', () => {
            if (!socket.nickName) return;
            delete users[socket.nickName];
            updateNicknames();
        });

        function updateNicknames () {
            io.sockets.emit('usernames', Object.keys(users));
        };
    });
}

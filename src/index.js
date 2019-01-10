
const path = require('path');                   // Camino para archivos
const http = require('http');                   // Funciones básicas de server http
const express = require('express');             // Resto de funciones de server
const app = express();                          // Instancia de App
const server = http.createServer(app);          // Servidor con App instanciada
const socketio = require('socket.io');          // Instancia de protocolo de tiempo real
const io = socketio.listen(server);             // protocolo de conexión en tiempo real canalizado en server

app.set('port', process.env.PORT || 3000);      // establece puerto
require('./sockets')(io);                       // Inicializa protocolo de tiempo real

app.use(express.static(path.join(__dirname, 'public')));        // Envía archios estáticos al cliente

server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'), '!!!');      // Lanza servidor
})

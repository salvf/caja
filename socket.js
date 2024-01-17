const io = require( "socket.io" )();
const socket = {
    io: io
};

io.on( "connection", function( socketio ) {
    console.log( "A user connected" );
    socketio.on('sync', (msg) => {
        console.log('message: ' + msg);
      });
    socketio.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = socket;
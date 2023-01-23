const net = require('net');

var host = "0.0.0.0";
var portTCP = 2205;

const serverTCP = net.createServer(); 

serverTCP.listen(portTCP, host, () => { 
    console.log(`TCP Server listening`); 
});


serverTCP.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
	sock.write('salut');
});
/**
 * Auditor.js
 * @author Rachel Leupi / Michael Gogniat
 */
 
const net = require('net');
const dgram = require('dgram');

let hostTCP = '0.0.0.0';
let portTCP = 2205;

let hostUDP = '239.255.22.5';
let portUDP = 4005;

//active time for musicians
let activeTime = 5;


//map for musicians
let musicianList = new Map();

//TCP Side for client

const serverTCP = net.createServer(); 

serverTCP.listen(portTCP, hostTCP, () => { 
    console.log('TCP Server listening'); 
});


serverTCP.on('connection', function(sock) {
    console.log('Client connected on TCP');
	
	//remove inactive musicians from map
	removeOld();
	
	//convert into json excluding "activeLast" and use correct format for datetime activeSince
	let json = JSON.stringify(Array.from(musicianList.entries()).map(([uuid, value]) => {
		let { instrument, activeSince } = value;
		return { uuid, instrument, activeSince: new Date(activeSince).toISOString() };
	}));
	
	//send data
	sock.write(json);
	
	//close
	sock.end();
});


//UDP Side for musicians

const serverUDP = dgram.createSocket('udp4');

serverUDP.bind(portUDP, function() {
	console.log('Join multicast');
	serverUDP.addMembership(hostUDP);
});

serverUDP.on('listening', () => {
	const address = serverUDP.address();
    console.log('UDP Server listening');
});


//Receive data from musicians
serverUDP.on('message', (message, remote) => {
    console.log('Server received message: ${message}');
	let data = JSON.parse(message);
	
	//get actual time and instrument played
	let newValue = {
		instrument: getInstrument(data.sound),
		activeLast: Date.now()
	};
	
	
	//to not overide activeSince if musicians already exist
	let known = musicianList.get(data.uuid);
	newValue.activeSince = known ? known.activeSince : Date.now();
	
	//add or update into the map
	musicianList.set(data.uuid, newValue);
});


//get instrument's name by sound
function getInstrument(sound) {
    switch (sound) {
        case "ti-ta-ti":
            return 'piano';
        case "pouet":
            return 'trumpet';
        case "trulu":
            return 'flute';
        case "gzi-gzi":
            return 'violin';
        case "boum-boum":
            return 'drum';
        default:
            return "";
    }
}

//remove inactive musicians from map
function removeOld() {
	for (const [uuid, value] of musicianList) {
		const timeDiff = (Date.now() - value.activeLast) / 1000;
		if (timeDiff > activeTime) musicianList.delete(uuid);
	}
}


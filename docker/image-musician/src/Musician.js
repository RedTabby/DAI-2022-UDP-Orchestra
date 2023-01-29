/**
 * Musician.js
 * @author Rachel Leupi
 */

//___________________________________________________________Function
/**
 * Function to get the sound of the instrument.
 * @param instrument : string of the command line.
 * @returns {string} : The sound of the instrument.
 */
function getSound(instrument) {
    switch (instrument) {
        case 'piano':
            return "ti-ta-ti";
        case 'trumpet':
            return "pouet";
        case 'flute':
            return "trulu";
        case 'violin':
            return "gzi-gzi";
        case 'drum':
            return "boum-boum";
        default:
            return "";
    }
}

/**
 *
 * Define the interval of time to send periodically the UDP datagram.
 * In milliseconds
 * @type {number}
 */
const interval = 1000;

/**
 * Send Periodically UDP datagram at the multicast group witch contain the sound of the instrument.
 * @returns {Promise<void>}
 */
const sendUDPData = async function(message, socket, payload){
    socket.send (message, 0, message.length , 4005 , "239.255.22.5" ,
        function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + socket.address().port);
        });
}

//____________________________________________________"MAIN"

//get the instrument from the command line.
if(process.argv.length < 3){
    console.log("No instruments found");
}else {
    const instrument = process.argv[2];

// Get the sound to send.
    const sound = getSound(instrument);

// return if the instrument is not known.
    if(sound === ""){ console.log("this instrument isn't known"); return;}

// We use a standard Node.js module to work with UDP
    const dgram = require('dgram');

// Let's create a datagram socket. We will use it to send our UDP datagrams
    const s = dgram.createSocket('udp4');

// Create a UUID
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();

    const music = { uuid : id, sound : sound};

    const payload = JSON.stringify(music);
    message = new Buffer(payload);

// Call the async function.
    setInterval(function() {
        sendUDPData(message, s, payload).catch(console.log);
    }, interval);

}
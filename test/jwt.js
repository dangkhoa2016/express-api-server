
// const jwt = require('../server/services').JwtService;
const { JwtService } = require('../server/services');

// require('dotenv').config({ path: './dev.env' });


var payload = 'secret';
//var payload = {f:'secret'};

var token = JwtService.sign(payload);
console.log("Token :" + token);

/*
 ====================   JST Verify =====================
*/


var legit = JwtService.verify(token);
console.log("\nJWT verification result: " + JSON.stringify(legit));

/*
 ====================   JST Decode =====================
*/
var decoded = JwtService.decode(token);
console.log("\nDecoded jwt: " + JSON.stringify(decoded));


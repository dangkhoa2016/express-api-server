const https = require("https");
const fs = require("fs");

const file = fs.createWriteStream("./database/express-app.db");
const request = https.get(
  "https://Basic-HTML5-Template.xo8ox.repl.co/express-app.db",
  function(response) {
    response.pipe(file);
  }
);

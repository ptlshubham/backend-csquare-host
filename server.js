var fs = require('fs');
var http = require('http');
var https = require('https');
const app = require("./app");
const port=3500;
var privateKey  = fs.readFileSync('./src/ssl/server.key').toString();
var certificate = fs.readFileSync('./src/ssl/server.crt').toString();

var credentials = {key: privateKey, cert: certificate};
var express = require('express');


// your express configuration here
//var server = https.createServer(credentials, app);
var server = http.createServer(app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});

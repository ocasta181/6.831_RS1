var http = require("http");
var connect = require("connect");
var serveStatic = require("serve-static");
var fs = require("fs");

users = [];

connect().use(serveStatic("C:\\Users\\afoster\\Documents\\GitHub\\6.831_RS1")).listen(8080);

/*
http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8888);
*/
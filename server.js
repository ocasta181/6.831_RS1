var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(8000);

//var http = require("http");

/*

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require("fs");

fs.writeFile("C:\\Users\\afoster\\Documents\\GitHub\\6.831_RS1\\testData.txt", "this is a test", function(err){
  	if(err){
  		return console.log(err);
  	};
  	console.log("The file was saved!");
  });

//app.listen(80);


/*
app.get('/', function(req, res){
  res.sendfile(__dirname + 'index.html');
  res.sendfile(__dirname + 'style.css');
  res.sendfile(__dirname + 'main.js');
});

/*
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
*/
/**

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
/*
users = [];

connect().use(serveStatic("C:\\Users\\afoster\\Documents\\GitHub\\6.831_RS1")).listen(8080);

var write = fs.createWriteStream("C:\\Users\\afoster\\Documents\\GitHub\\6.831_RS1\\test.txt", {'flags': 'a'});
write.write("This is the first line of my log\n"); //will append to a log.  Let's talk monday about the other stuff
*/



http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8888);

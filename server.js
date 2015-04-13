var express = require('express');
var app = express();
var port = process.env.PORT || 1337;
var fs = require("fs");

var EWRatio_options = [1.33, 2, 3];
var cursorType_options =["Point", "Bubble"];
var amplitude_options = [256, 512, 768];
var width_options = [8, 16, 32];
var userID;

var test_order_base = [];
var test_order; 
var latin_square_base = [];
var current_latin_square = [];

var initializeTestOrderBase = function(){
    for(var i = 0; i <=26; i++){
        test_order_base.push(i);
    }
}

var generate_latin_square = function(){
 for (var i = 0; i < 3; i++){
    for(var j = 0; j < 3; j++){
        for (var k = 0; k < 3; k++){
            latin_square_base.push({EWRatio: EWRatio_options[i], amplitude: amplitude_options[j], width: width_options[k]});
        };
    };

 };

 for (var i = 0; i < userID%27; i++){
    var shift  = latin_square_base.shift();
    latin_square_base.push(shift);
 };

};




 

 
 var dataFile = "data/results.txt"
 
var express = require('express');
var app = express();
 
app.get('/api/data', function(req, res){
    res.send("test");
});
 
app.post('/api/data', function(req, res){
    console.log("req: ",req.body);
    var data = req.body.data;
    
    fs.appendFile(dataFile, data);
});
 
 
 
app.use(express.static('public'));

console.log("Submit GET or POST to http://localhost:" + port);
app.listen(port);
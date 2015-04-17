var express = require('express');
var fs = require("fs");
var app = express();
var port = process.env.PORT || 1337;
var dataFile = "test-data.csv"

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var EWRatio_options = [1.33, 2, 3];
var cursorType_options =["Point", "Bubble"];
var amplitude_options = [256, 512, 768];
var width_options = [8, 16, 32];

var userID = 0;
var latin_square = [];
var latin_square_custom;


var generate_latin_square = function(){
    for (var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            for (var k = 0; k < 3; k++){
                latin_square.push({EWRatio: EWRatio_options[i], amplitude: amplitude_options[j], width: width_options[k]});
            };
        };
    };

};

var custom_latin_square = function (){
    latin_square_custom = latin_square;
    for (var i = 0; i < userID%27; i++){
        var shift  = latin_square_custom.shift();
        latin_square.push(shift);
    };
};
 
generate_latin_square();

app.get('/api/data', function(req, res){
    userID++;
    console.log(userID);
    custom_latin_square();
    res.json({"userID": userID, "latin_square_custom": latin_square_custom, "starting_pointer": cursorType_options[userID%2]});
});
 
app.post('/api/data', function(req, res){
    console.log(req.body)
    var data = req.body.results+"\n";
    
    fs.appendFile(dataFile, data);
    res.send();
});
 
 
 
app.use(express.static('public'));

console.log("Submit GET or POST to http://localhost:" + port);
app.listen(port);
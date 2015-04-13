var express = require('express');
var sqlite3 = require('sqlite3');
var app = express();
var port = process.env.PORT || 1337;
var db = new sqlite3.Database('data/demo');
 
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
    db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
});
 
 
 
var express = require('express');
var app = express();
 
app.get('/api/data', function(req, res){
    db.get("SELECT value FROM counts", function(err, row){
        res.json({ "count" : row.value });
    });
});
 
app.post('/api/data', function(req, res){
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});
 
 
 
app.use(express.static('public'));

console.log("Submit GET or POST to http://localhost:" + port);
app.listen(port);
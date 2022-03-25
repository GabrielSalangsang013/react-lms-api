var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");

app.use(bodyParser.json())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});

app.post('/api/login', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      let gotData = JSON.parse(data);
      let postdata = req.body;
      let outputMessage = 'FALSE';

      for(let i = 0; i < gotData.length; i++) {
         if(postdata.username === gotData[i].username && postdata.password === gotData[i].password) {
            outputMessage = 'TRUE';
         }
      }

      res.send(JSON.stringify(outputMessage));
   });
})

app.get('/api/news', function (req, res) {
   fs.readFile( __dirname + "/" + "news.json", 'utf8', function (err, data) {
      res.send(data);
   });
})

app.post('/api/online', function (req, res) {
   fs.readFile( __dirname + "/" + "online.json", 'utf8', function (err, data) {
      res.send(data);
   });
})

app.post('/api/quotes', function (req, res) {
   fs.readFile( __dirname + "/" + "quotes.json", 'utf8', function (err, data) {
      res.send(data);
   });
})

app.post('/signup/create', (req, res) => {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      let gotData = JSON.parse(data);
      let postdata = req.body;

      let isExistUsername = false;
      let isExistPassword = false;

      for(let i = 0; i < gotData.length; i++) {
         if(gotData[i].username === postdata.username) {
            isExistUsername = true;
         }
         if(gotData[i].password === postdata.password) {
            isExistPassword = true;
         }
      }

      if(isExistUsername == true || isExistPassword == true) {
         res.send(JSON.stringify({'result': 'Username or Password has already exist'}));
         console.log('Username or Password has already exist');
      }else {
         // Inserting new Data
         gotData.push(postdata);
         fs.writeFile('users.json', JSON.stringify(gotData), 'utf8', () => {
            console.log('New User added to the JSON file');
         });
         res.send(JSON.stringify(gotData));
      }
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
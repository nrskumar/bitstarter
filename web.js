var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  //var k = fs.readFileSync('./index.html');
    //response.send(k.toString('utf-8'));
    response.send('dadfasfas');
//     response.end();
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var express = require('express')
var bodyparser = require('body-parser')


var app = express()
app.use(bodyparser.json())


app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post("/businesses", function(req, res){
    console.log(req.body)
    res.send("hi you there")
})
app.listen(3000, function () {
    console.log('Hello Yelper')
});